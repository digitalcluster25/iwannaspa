import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'

/**
 * Упрощенный тестовый компонент с таймаутами
 */
export function DebugPage() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [timing, setTiming] = useState<number>(0)
  const [testName, setTestName] = useState<string>('')

  // Wrapper с таймаутом
  const withTimeout = async <T,>(
    promise: Promise<T>,
    timeoutMs: number = 5000
  ): Promise<T> => {
    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error(`Timeout after ${timeoutMs}ms`)), timeoutMs)
    )
    return Promise.race([promise, timeoutPromise])
  }

  const testSimple = async () => {
    setTestName('Проверка Supabase client')
    setLoading(true)
    setError(null)
    setResult(null)
    
    try {
      const startTime = performance.now()
      
      // Просто проверяем что клиент создан
      const client = supabase
      const hasClient = !!client
      const hasAuth = !!client.auth
      const hasFrom = typeof client.from === 'function'
      
      const endTime = performance.now()
      const duration = Math.round(endTime - startTime)
      
      setTiming(duration)
      setResult({
        clientExists: hasClient,
        authExists: hasAuth,
        fromExists: hasFrom,
        supabaseUrl: client.supabaseUrl,
      })
      
      console.log('✅ Client check:', { hasClient, hasAuth, hasFrom })
    } catch (err: any) {
      console.error('❌ Exception:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const testAuth = async () => {
    setTestName('Проверка авторизации')
    setLoading(true)
    setError(null)
    setResult(null)
    
    try {
      const startTime = performance.now()
      
      const { data, error: authError } = await withTimeout(
        supabase.auth.getSession(),
        5000
      )
      
      const endTime = performance.now()
      const duration = Math.round(endTime - startTime)
      
      setTiming(duration)
      
      if (authError) {
        setError(authError.message)
      } else {
        setResult({
          hasSession: !!data.session,
          userId: data.session?.user?.id || 'нет',
          email: data.session?.user?.email || 'нет',
        })
      }
      
      console.log('✅ Auth check:', data)
    } catch (err: any) {
      console.error('❌ Exception:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const testProfilesCount = async () => {
    setTestName('Подсчет записей в profiles')
    setLoading(true)
    setError(null)
    setResult(null)
    
    try {
      const startTime = performance.now()
      
      const { count, error: countError } = await withTimeout(
        supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true }),
        5000
      )
      
      const endTime = performance.now()
      const duration = Math.round(endTime - startTime)
      
      setTiming(duration)
      
      if (countError) {
        setError(countError.message)
      } else {
        setResult({
          totalRecords: count,
          message: 'Запрос выполнен успешно',
        })
      }
      
      console.log('✅ Count check:', count)
    } catch (err: any) {
      console.error('❌ Exception:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const testProfilesSimple = async () => {
    setTestName('Запрос 1 записи из profiles')
    setLoading(true)
    setError(null)
    setResult(null)
    
    try {
      const startTime = performance.now()
      
      const { data, error: queryError } = await withTimeout(
        supabase
          .from('profiles')
          .select('id, role')
          .limit(1)
          .single(),
        5000
      )
      
      const endTime = performance.now()
      const duration = Math.round(endTime - startTime)
      
      setTiming(duration)
      
      if (queryError) {
        setError(queryError.message)
      } else {
        setResult(data)
      }
      
      console.log('✅ Query check:', data)
    } catch (err: any) {
      console.error('❌ Exception:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>🔧 Диагностика (с таймаутами)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-3">
            <Button
              onClick={testSimple}
              disabled={loading}
              variant="outline"
            >
              1. Проверка Supabase client
            </Button>
            
            <Button
              onClick={testAuth}
              disabled={loading}
              variant="outline"
            >
              2. Тест авторизации (таймаут 5с)
            </Button>
            
            <Button
              onClick={testProfilesCount}
              disabled={loading}
              variant="outline"
            >
              3. Подсчет записей profiles (таймаут 5с)
            </Button>

            <Button
              onClick={testProfilesSimple}
              disabled={loading}
              variant="outline"
            >
              4. Запрос 1 записи profiles (таймаут 5с)
            </Button>
          </div>

          {loading && (
            <div className="bg-blue-50 border border-blue-200 rounded p-4">
              <p className="text-blue-700">⏳ {testName}...</p>
              <p className="text-sm text-blue-600 mt-1">
                Макс. 5 секунд, потом таймаут
              </p>
            </div>
          )}

          {timing > 0 && !loading && (
            <div className={`border rounded p-4 ${
              timing < 500 ? 'bg-green-50 border-green-200' :
              timing < 2000 ? 'bg-yellow-50 border-yellow-200' :
              'bg-red-50 border-red-200'
            }`}>
              <p className={`font-bold ${
                timing < 500 ? 'text-green-700' :
                timing < 2000 ? 'text-yellow-700' :
                'text-red-700'
              }`}>
                ⏱️ {timing}ms
              </p>
              <p className="text-sm mt-1">
                {timing < 500 && '✅ Отлично'}
                {timing >= 500 && timing < 2000 && '⚠️ Медленно'}
                {timing >= 2000 && '🔴 Критично медленно'}
              </p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded p-4">
              <p className="text-red-700 font-bold">❌ Ошибка:</p>
              <pre className="text-sm mt-2 text-red-600 whitespace-pre-wrap">
                {error}
              </pre>
              {error.includes('Timeout') && (
                <p className="text-sm mt-2 text-red-600">
                  💡 Запрос завис более 5 секунд. Проблема с БД или сетью.
                </p>
              )}
            </div>
          )}

          {result && !error && (
            <div className="bg-gray-50 border border-gray-200 rounded p-4">
              <p className="text-gray-700 font-bold mb-2">✅ Результат:</p>
              <pre className="text-sm text-gray-600 whitespace-pre-wrap overflow-auto max-h-64">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          )}

          <div className="bg-orange-50 border border-orange-200 rounded p-4 text-sm">
            <p className="font-bold text-orange-700 mb-2">⚠️ Важно:</p>
            <ul className="text-orange-600 space-y-1">
              <li>• Если тесты 1-2 проходят, но 3-4 таймаутятся → проблема с RLS</li>
              <li>• Если все тесты таймаутятся → проблема с сетью/Supabase</li>
              <li>• Открой консоль (F12) для деталей</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
