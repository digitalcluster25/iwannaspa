import { createContext, useContext, useEffect, useState, useRef } from 'react'
import { supabaseAuth } from '@/lib/supabase'
import { database } from '@/lib/database'
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

  const isAdmin = profile?.role === 'admin'
  const isVendor = profile?.role === 'vendor'
  const isUser = profile?.role === 'user'

  const fetchUserProfile = async (userId: string) => {
    if (fetchingProfile.current) {
      console.log('🔍 Profile fetch already in progress, skipping...')
      return null
    }

    try {
      console.log('🔍 Starting profile fetch for user:', userId)
      fetchingProfile.current = true
      
      // Пробуем загрузить профиль с коротким таймаутом
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 3000) // 3 секунды
      
             const { data, error } = await database
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()
        .abortSignal(controller.signal)
      
      clearTimeout(timeoutId)
      console.log('🔍 Profile query result:', { data, error })

      if (error) {
        console.error('❌ Error fetching user profile:', error)
        if (error.code === 'PGRST116') {
          console.log('🆕 Profile not found, creating default profile')
          const { data: newProfile } = await database
            .from('profiles')
            .insert({ 
              id: userId, 
              name: 'User', 
              role: 'user', 
              active: true 
            })
            .select()
            .single()
          
          if (newProfile) {
            console.log('✅ New profile created:', newProfile)
            return newProfile as UserProfile
          }
        }
        return null
      }

      console.log('✅ Profile loaded successfully:', data)
      return data as UserProfile
    } catch (error: any) {
      console.error('❌ Exception in fetchUserProfile:', error)
      if (error.name === 'AbortError') {
        console.log('⏰ Profile fetch timed out, will use fallback')
      }
      return null
    } finally {
      console.log('🔍 Profile fetch completed')
      fetchingProfile.current = false
    }
  }

  useEffect(() => {
    let mounted = true

    const initAuth = async () => {
      try {
        console.log('🔍 AuthContext: Initializing auth...')
        const { data: { session } } = await supabaseAuth.auth.getSession()
        
        console.log('🔍 AuthContext: Session loaded:', session?.user?.email)
        
        if (!mounted) return

        setSession(session)
        setUser(session?.user ?? null)
        
        if (session?.user) {
          console.log('🔍 AuthContext: Loading profile for user:', session.user.id)
          
          // Для digitalcluster25@gmail.com создаем профиль админа сразу
          if (session.user.email === 'digitalcluster25@gmail.com') {
            console.log('🔍 Creating admin profile for digitalcluster25@gmail.com')
            const adminProfile: UserProfile = {
              id: session.user.id,
              name: 'Admin',
              phone: null,
              role: 'admin',
              active: true,
              created_at: session.user.created_at,
              updated_at: session.user.updated_at || session.user.created_at
            }
            setProfile(adminProfile)
            console.log('✅ Admin profile set:', adminProfile)
          } else {
            // Для других пользователей пытаемся загрузить профиль
            const userProfile = await fetchUserProfile(session.user.id)
            if (mounted) {
              if (!userProfile) {
                console.log('⚠️ Profile not loaded, creating from session data')
                // Создаем профиль из данных сессии как fallback
                const fallbackProfile: UserProfile = {
                  id: session.user.id,
                  name: session.user.user_metadata?.name || 'User',
                  phone: null,
                  role: 'user',
                  active: true,
                  created_at: session.user.created_at,
                  updated_at: session.user.updated_at || session.user.created_at
                }
                setProfile(fallbackProfile)
                console.log('🔍 AuthContext: Fallback profile set:', fallbackProfile)
              } else {
                setProfile(userProfile)
                console.log('🔍 AuthContext: Profile set:', userProfile)
              }
            }
          }
        }
      } catch (error) {
        console.error('❌ AuthContext: Init auth error:', error)
      } finally {
        if (mounted) {
          console.log('🔍 AuthContext: Setting loading to false')
          setLoading(false)
        }
      }
    }

    initAuth()

           const { data: { subscription } } = supabaseAuth.auth.onAuthStateChange(
      async (_event, session) => {
        console.log('🔍 AuthContext: Auth state changed:', _event, session?.user?.email)
        if (!mounted) return

        setSession(session)
        setUser(session?.user ?? null)
        
        if (session?.user) {
          // Для digitalcluster25@gmail.com создаем профиль админа сразу
          if (session.user.email === 'digitalcluster25@gmail.com') {
            console.log('🔍 Creating admin profile for digitalcluster25@gmail.com')
            const adminProfile: UserProfile = {
              id: session.user.id,
              name: 'Admin',
              phone: null,
              role: 'admin',
              active: true,
              created_at: session.user.created_at,
              updated_at: session.user.updated_at || session.user.created_at
            }
            setProfile(adminProfile)
          } else {
            // Для других пользователей пытаемся загрузить профиль
            const userProfile = await fetchUserProfile(session.user.id)
            if (mounted) {
              if (!userProfile) {
                console.log('⚠️ Profile not loaded, creating from session data')
                // Создаем профиль из данных сессии как fallback
                const fallbackProfile: UserProfile = {
                  id: session.user.id,
                  name: session.user.user_metadata?.name || 'User',
                  phone: null,
                  role: 'user',
                  active: true,
                  created_at: session.user.created_at,
                  updated_at: session.user.updated_at || session.user.created_at
                }
                setProfile(fallbackProfile)
              } else {
                setProfile(userProfile)
              }
            }
          }
        } else {
          setProfile(null)
        }
      }
    )

    return () => {
      console.log('🔍 AuthContext: Cleaning up...')
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  const signIn = async (email: string, password: string) => {
    const { error } = await supabaseAuth.auth.signInWithPassword({ email, password })
    if (error) throw error
  }

  const signUp = async (
    email: string,
    password: string,
    name: string,
    role: 'admin' | 'vendor' | 'user' = 'user'
  ) => {
             const { data, error } = await supabaseAuth.auth.signUp({
      email,
      password,
      options: { data: { name } },
    })
    
    if (error) throw error
    
    if (data.user) {
      await database.from('profiles').insert({
        id: data.user.id,
        name,
        role,
        active: role !== 'vendor',
      })
    }
  }

  const signOut = async () => {
    const { error } = await supabaseAuth.auth.signOut()
    if (error) throw error
  }

  const updateProfile = async (data: { name?: string; phone?: string }) => {
    if (!user) return
    
    const { error } = await database
      .from('profiles')
      .update(data)
      .eq('id', user.id)
    
    if (error) throw error
    
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
