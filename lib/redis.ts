import { Redis } from '@upstash/redis'

export const redis = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
})

// Keys for storing data
export const BARBERS_KEY = 'barbers'
export const SERVICES_KEY = 'services'
export const APPOINTMENTS_KEY = 'appointments'
export const USERS_KEY = 'users'
export const SESSION_KEY = 'session'
