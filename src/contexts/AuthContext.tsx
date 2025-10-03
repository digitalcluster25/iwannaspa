import { createContext, useContext, useEffect, useState, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import type { User, Session } from '@supabase/supabase-js'

interface UserProfile {
  id: string
  name: string | null
  phone: string | null
  role: 'admin' | 'vendor' | 'user'
  active: boolean
  created_at: string
  updated_at: string
}

interface AuthContextType {
  user: User | null
  session: Session | null
  profile: UserProfile | null
  loading: boolean
  isAdmin: boolean
  isVendor: boolean
  isUser: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, name: string, role?: 'admin' | 'vendor' | 'user') => Promise<void>
  signOut: () => Promise<void>
  updateProfile: (data: { name?: string; phone?: string }) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const fetchingProfile = useRef(false)
  const profileCache = useRef<Map<string, UserProfile>>(new Map())

  const isAdmin = profile?.role === 'admin'
  const isVendor = profile?.role === 'vendor'
  const isUser = profile?.role === 'user'

  const fetchUserProfile = async (userId: string) => {
    // Защита от множественных запросов
    if (fetchingProfile.current) {
      console.log('⚠️ Already fetching profile, skipping...')
      return null
    }

    // Проверяем кэш
    const cached = profileCache.current.get(userId)
    if (cached) {
      console.log('✅ Using cached profile')
      return cached
    }

    try {
      fetchingProfile.current = true
      console.log('🔍 Fetching profile for:', userId)
      
      const startTime = Date.now()
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()
      
      const endTime = Date.now()
      console.log(`⏱️ Profile query took: ${endTime - startTime}ms`)

      if (error) {
        if (error.code === 'PGRST116') {
          // Профиль не найден - создаем
          const { data: newProfile } = await supabase
            .from('profiles')
            .insert({ id: userId, name: 'User', role: 'user', active: true })
            .select()
            .single()
          
          if (newProfile) {
            profileCache.current.set(userId, newProfile as UserProfile)
            return newProfile as UserProfile
          }
        }
        console.error('❌ Error fetching profile:', error)
        return null
      }

      console.log('✅ Profile loaded:', data)
      profileCache.current.set(userId, data as UserProfile)
      return data as UserProfile
    } catch (error) {
      console.error('❌ Exception:', error)
      return null
    } finally {
      fetchingProfile.current = false
    }
  }

  useEffect(() => {
    let mounted = true

    const initAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        
        if (!mounted) return

        setSession(session)
        setUser(session?.user ?? null)
        
        if (session?.user) {
          const userProfile = await fetchUserProfile(session.user.id)
          if (mounted) {
            setProfile(userProfile)
          }
        }
      } catch (error) {
        console.error('❌ Init auth error:', error)
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    initAuth()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (!mounted) return

        setSession(session)
        setUser(session?.user ?? null)
        
        if (session?.user) {
          // Используем кэш если это тот же пользователь
          const cached = profileCache.current.get(session.user.id)
          if (cached) {
            setProfile(cached)
          } else {
            const userProfile = await fetchUserProfile(session.user.id)
            if (mounted) {
              setProfile(userProfile)
            }
          }
        } else {
          setProfile(null)
        }
      }
    )

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
  }

  const signUp = async (
    email: string,
    password: string,
    name: string,
    role: 'admin' | 'vendor' | 'user' = 'user'
  ) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } },
    })
    
    if (error) throw error
    
    if (data.user) {
      await supabase.from('profiles').insert({
        id: data.user.id,
        name,
        role,
        active: role !== 'vendor',
      })
    }
  }

  const signOut = async () => {
    profileCache.current.clear()
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  const updateProfile = async (data: { name?: string; phone?: string }) => {
    if (!user) return
    
    const { error } = await supabase
      .from('profiles')
      .update(data)
      .eq('id', user.id)
    
    if (error) throw error
    
    // Очищаем кэш
    profileCache.current.delete(user.id)
    
    // Перезагружаем профиль
    const updated = await fetchUserProfile(user.id)
    setProfile(updated)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        loading,
        isAdmin,
        isVendor,
        isUser,
        signIn,
        signUp,
        signOut,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
