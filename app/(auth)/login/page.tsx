'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Scissors, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { login } from '@/app/actions/auth'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    
    const result = await login(email, password)
    
    if (result.success && result.user) {
      // Redirect based on role
      if (result.user.role === 'admin') {
        router.push('/admin')
      } else {
        router.push('/dashboard')
      }
      router.refresh()
    } else {
      setError(result.error || 'Ошибка входа. Проверь данные и попробуй снова.')
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <Link href="/" className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary">
            <Scissors className="h-7 w-7 text-primary-foreground" />
          </Link>
          <CardTitle className="text-2xl font-bold">Рады видеть снова</CardTitle>
          <CardDescription>
            Войдите в свой аккаунт BarberBook, чтобы записываться онлайн.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="flex items-center gap-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                <AlertCircle className="h-4 w-4" />
                {error}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Эл.почта</Label>
              <Input
                id="email"
                type="email"
                placeholder="nurs@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Пароль</Label>
                <Link 
                  href="#" 
                  className="text-sm text-muted-foreground hover:text-primary"
                >
                  Забыли пароль?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="Введите пароль"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Вход...' : 'Войти в аккаунт'}
            </Button>
          </form>
          <div className="mt-6 text-center text-sm">
            <span className="text-muted-foreground">{"Нет аккаунта? "}</span>
            <Link href="/register" className="font-medium text-primary hover:underline">
              Зарегистрироваться  
            </Link>
          </div>
          <div className="mt-4 rounded-lg bg-muted p-3 text-xs text-muted-foreground">
            <p className="font-medium mb-1">Demo accounts:</p>
            <p>Клиент: Nurs1@gmail.com / password123</p>
            <p>Админ: admin@barberbook.com / admin123</p>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}
