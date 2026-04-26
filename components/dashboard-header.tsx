'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Scissors, User, Calendar, LogOut, Home, Shield } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { logout } from '@/app/actions/auth'
import type { User as UserType } from '@/lib/types'

interface DashboardHeaderProps {
  user: Omit<UserType, 'password'> | null
}

export function DashboardHeader({ user }: DashboardHeaderProps) {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    await logout()
    router.push('/')
    router.refresh()
  }

  const navItems = [
    { href: '/', label: 'Главная', icon: Home },
    { href: '/dashboard', label: 'Записаться', icon: Calendar },
    { href: '/profile', label: 'Профиль', icon: User },
  ]

  // Add admin link if user is admin
  if (user?.role === 'admin') {
    navItems.push({ href: '/admin', label: 'Админ панель', icon: Shield })
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary">
            <Scissors className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold">BarberBook</span>
        </Link>
        
        <nav className="flex items-center gap-1">
          {user ? (
            <>
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href
                return (
                  <Link key={item.href} href={item.href}>
                    <Button
                      variant={isActive ? 'secondary' : 'ghost'}
                      size="sm"
                      className={cn(
                        'gap-2',
                        isActive && 'bg-secondary'
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      <span className="hidden sm:inline">{item.label}</span>
                    </Button>
                  </Link>
                )
              })}
              <Button 
                variant="ghost" 
                size="sm" 
                className="gap-2 text-muted-foreground"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Выйти</span>
              </Button>
            </>
          ) : (
            <Link href="/login">
              <Button size="sm">Войти</Button>
            </Link>
          )}
        </nav>
      </div>
    </header>
  )
}
