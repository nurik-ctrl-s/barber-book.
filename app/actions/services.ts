'use server'

import { redis, SERVICES_KEY } from '@/lib/redis'
import { services as initialServices } from '@/lib/mock-data'
import type { Service } from '@/lib/types'
import { revalidatePath } from 'next/cache'

export async function getServices(): Promise<Service[]> {
  const services = await redis.get<Service[]>(SERVICES_KEY)
  
  if (!services || services.length === 0) {
    // Seed with initial data if empty
    await redis.set(SERVICES_KEY, initialServices)
    return initialServices
  }
  
  return services
}

export async function addService(data: Omit<Service, 'id'>): Promise<Service> {
  const services = await getServices()
  
  const newService: Service = {
    id: crypto.randomUUID(),
    name: data.name,
    description: data.description,
    price: data.price,
    duration: data.duration,
  }
  
  await redis.set(SERVICES_KEY, [...services, newService])
  
  revalidatePath('/admin/services', 'page')
  revalidatePath('/dashboard', 'page')
  
  return newService
}

export async function updateService(id: string, data: Partial<Omit<Service, 'id'>>): Promise<Service | null> {
  const services = await getServices()
  const index = services.findIndex(s => s.id === id)
  
  if (index === -1) return null
  
  const updatedService = { ...services[index], ...data }
  services[index] = updatedService
  
  await redis.set(SERVICES_KEY, services)
  
  revalidatePath('/admin/services', 'page')
  revalidatePath('/dashboard', 'page')
  
  return updatedService
}

export async function deleteService(id: string): Promise<boolean> {
  const services = await getServices()
  const filtered = services.filter(s => s.id !== id)
  
  if (filtered.length === services.length) return false
  
  await redis.set(SERVICES_KEY, filtered)
  
  revalidatePath('/admin/services', 'page')
  revalidatePath('/dashboard', 'page')
  
  return true
}
