'use server'

import { cookies } from 'next/headers'
import { redis, USERS_KEY, SESSION_KEY } from '@/lib/redis'
import type { User } from '@/lib/types'

// Initial users with admin and client accounts
const initialUsers: User[] = [
  {
    id: '1',
    name: 'Админ Пользователь',
    email: 'admin@barberbook.com',
    phone: '+996 999 558 990',
    avatar: '/Admin.jpg', // Next.js сам поймет, что файл в папке public,
    memberSince: 'January 2024',
    role: 'admin',
    password: 'admin123'
  },
  {
    id: '2',
    name: 'Nursultan',
    email: 'Nurs1@gmail.com',
    phone: '+996 999 558 990',
    avatar: '/client-main.jpg',
    memberSince: 'January 2020',
    role: 'client',
    password: 'password123'
  }
]

async function getUsers(): Promise<User[]> {
  const users = await redis.get<User[]>(USERS_KEY)
  
  if (!users || users.length === 0) {
    await redis.set(USERS_KEY, initialUsers)
    return initialUsers
  }
  
  return users
}

export async function login(email: string, password: string): Promise<{ success: boolean; error?: string; user?: Omit<User, 'password'> }> {
  const users = await getUsers()
  const user = users.find(u => u.email === email && u.password === password)
  
  if (!user) {
    return { success: false, error: 'Неверный email или пароль' }
  }
  
  // Create session
  const sessionId = crypto.randomUUID()
  await redis.set(`${SESSION_KEY}:${sessionId}`, { userId: user.id }, { ex: 60 * 60 * 24 * 7 }) // 7 days
  
  // Set cookie
  const cookieStore = await cookies()
  cookieStore.set('session', sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7 // 7 days
  })
  
  // Return user without password
  const { password: _, ...userWithoutPassword } = user
  return { success: true, user: userWithoutPassword }
}

export async function logout(): Promise<void> {
  const cookieStore = await cookies()
  const sessionId = cookieStore.get('session')?.value
  
  if (sessionId) {
    await redis.del(`${SESSION_KEY}:${sessionId}`)
    cookieStore.delete('session')
  }
}

export async function getCurrentUser(): Promise<Omit<User, 'password'> | null> {
  const cookieStore = await cookies()
  const sessionId = cookieStore.get('session')?.value
  
  if (!sessionId) return null
  
  const session = await redis.get<{ userId: string }>(`${SESSION_KEY}:${sessionId}`)
  if (!session) return null
  
  const users = await getUsers()
  const user = users.find(u => u.id === session.userId)
  
  if (!user) return null
  
  const { password: _, ...userWithoutPassword } = user
  return userWithoutPassword
}

export async function register(data: { name: string; email: string; phone: string; password: string }): Promise<{ success: boolean; error?: string; user?: Omit<User, 'password'> }> {
  const users = await getUsers()
  
  // Check if email already exists
  if (users.find(u => u.email === data.email)) {
    return { success: false, error: 'Email уже зарегистрирован' }
  }
  
  const newUser: User = {
    id: crypto.randomUUID(),
    name: data.name,
    email: data.email,
    phone: data.phone,
    avatar: '/client-main.jpg',
    memberSince: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
    role: 'client',
    password: data.password
  }
  
  await redis.set(USERS_KEY, [...users, newUser])
  
  // Auto login
  return login(data.email, data.password)
}
