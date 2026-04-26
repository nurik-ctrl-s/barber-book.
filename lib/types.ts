export interface Barber {
  id: string
  name: string
  photo: string
  experience: number
  specialty: string
  rating: number
  reviewCount: number
}

export interface Service {
  id: string
  name: string
  description: string
  price: number
  duration: number
}

export interface TimeSlot {
  time: string
  available: boolean
}

export interface Appointment {
  id: string
  barber: Barber
  service: Service
  date: string
  time: string
  status: 'upcoming' | 'completed' | 'cancelled'
}

export interface User {
  id: string
  name: string
  email: string
  phone: string
  avatar: string
  memberSince: string
  role: 'client' | 'admin'
  password?: string // Only stored in Redis, not sent to client
}

export interface StoredAppointment {
  id: string
  barberId: string
  barberName: string
  serviceId: string
  serviceName: string
  servicePrice: number
  serviceDuration: number
  date: string
  time: string
  status: 'upcoming' | 'completed' | 'cancelled'
  userId: string
  userName: string
  createdAt: string
}
