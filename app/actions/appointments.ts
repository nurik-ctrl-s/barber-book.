'use server'

import { redis, APPOINTMENTS_KEY } from '@/lib/redis'
import type { StoredAppointment } from '@/lib/types'
import { revalidatePath } from 'next/cache'
import { getCurrentUser } from './auth'

export async function getAppointments(): Promise<StoredAppointment[]> {
  const appointments = await redis.get<StoredAppointment[]>(APPOINTMENTS_KEY)
  return appointments || []
}

export async function getUserAppointments(userId: string): Promise<StoredAppointment[]> {
  const appointments = await getAppointments()
  return appointments.filter(a => a.userId === userId)
}

export async function createAppointment(data: {
  barberId: string
  barberName: string
  serviceId: string
  serviceName: string
  servicePrice: number
  serviceDuration: number
  date: string
  time: string
}): Promise<{ success: boolean; error?: string; appointment?: StoredAppointment }> {
  const user = await getCurrentUser()
  
  if (!user) {
    return { success: false, error: 'You must be logged in to book an appointment' }
  }
  
  const appointments = await getAppointments()
  
  // Check for conflicting appointments
  const hasConflict = appointments.some(
    a => a.barberId === data.barberId && 
         a.date === data.date && 
         a.time === data.time &&
         a.status !== 'cancelled'
  )
  
  if (hasConflict) {
    return { success: false, error: 'This time slot is no longer available' }
  }
  
  const newAppointment: StoredAppointment = {
    id: crypto.randomUUID(),
    ...data,
    status: 'upcoming',
    userId: user.id,
    userName: user.name,
    createdAt: new Date().toISOString()
  }
  
  await redis.set(APPOINTMENTS_KEY, [...appointments, newAppointment])
  
  revalidatePath('/profile')
  revalidatePath('/admin/appointments')
  revalidatePath('/dashboard')
  
  return { success: true, appointment: newAppointment }
}

export async function updateAppointmentStatus(
  id: string, 
  status: 'upcoming' | 'completed' | 'cancelled'
): Promise<{ success: boolean; error?: string }> {
  const appointments = await getAppointments()
  const index = appointments.findIndex(a => a.id === id)
  
  if (index === -1) {
    return { success: false, error: 'Appointment not found' }
  }
  
  appointments[index] = { ...appointments[index], status }
  await redis.set(APPOINTMENTS_KEY, appointments)
  
  revalidatePath('/profile')
  revalidatePath('/admin/appointments')
  
  return { success: true }
}

export async function deleteAppointment(id: string): Promise<{ success: boolean; error?: string }> {
  const appointments = await getAppointments()
  const filtered = appointments.filter(a => a.id !== id)
  
  if (filtered.length === appointments.length) {
    return { success: false, error: 'Appointment not found' }
  }
  
  await redis.set(APPOINTMENTS_KEY, filtered)
  
  revalidatePath('/profile')
  revalidatePath('/admin/appointments')
  
  return { success: true }
}
