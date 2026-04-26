'use server'

import { redis, BARBERS_KEY } from '@/lib/redis'
import { barbers as initialBarbers } from '@/lib/mock-data'
import type { Barber } from '@/lib/types'
import { revalidatePath } from 'next/cache'

export async function getBarbers(): Promise<Barber[]> {
  const barbers = await redis.get<Barber[]>(BARBERS_KEY)
  
  if (!barbers || barbers.length === 0) {
    // Seed with initial data if empty
    await redis.set(BARBERS_KEY, initialBarbers)
    return initialBarbers
  }
  
  return barbers
}

export async function addBarber(data: Omit<Barber, 'id' | 'rating' | 'reviewCount' | 'photo'>): Promise<Barber> {
  const barbers = await getBarbers()
  
  const newBarber: Barber = {
    id: crypto.randomUUID(),
    name: data.name,
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face',
    specialty: data.specialty,
    experience: data.experience,
    rating: 5.0,
    reviewCount: 0,
  }
  
  await redis.set(BARBERS_KEY, [...barbers, newBarber])
  
  revalidatePath('/admin/barbers', 'page')
  revalidatePath('/dashboard', 'page')
  
  return newBarber
}

export async function updateBarber(id: string, data: Partial<Omit<Barber, 'id'>>): Promise<Barber | null> {
  const barbers = await getBarbers()
  const index = barbers.findIndex(b => b.id === id)
  
  if (index === -1) return null
  
  const updatedBarber = { ...barbers[index], ...data }
  barbers[index] = updatedBarber
  
  await redis.set(BARBERS_KEY, barbers)
  
  revalidatePath('/admin/barbers', 'page')
  revalidatePath('/dashboard', 'page')
  
  return updatedBarber
}

export async function deleteBarber(id: string): Promise<boolean> {
  const barbers = await getBarbers()
  const filtered = barbers.filter(b => b.id !== id)
  
  if (filtered.length === barbers.length) return false
  
  await redis.set(BARBERS_KEY, filtered)
  
  revalidatePath('/admin/barbers', 'page')
  revalidatePath('/dashboard', 'page')
  
  return true
}
