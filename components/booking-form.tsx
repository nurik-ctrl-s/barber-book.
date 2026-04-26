'use client'

import { useState, useMemo } from 'react'
import { format, addDays, startOfDay } from 'date-fns'
import { CalendarIcon, Check, AlertCircle, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { BarberCard } from '@/components/barber-card'
import { ServiceCard } from '@/components/service-card'
import { TimeSlotPicker } from '@/components/time-slot-picker'
import { generateTimeSlots } from '@/lib/mock-data'
import type { Barber, Service } from '@/lib/types'
import { cn } from '@/lib/utils'
import { createAppointment } from '@/app/actions/appointments'

interface BookingFormProps {
  barbers: Barber[]
  services: Service[]
  isLoggedIn: boolean
}

export function BookingForm({ barbers, services, isLoggedIn }: BookingFormProps) {
  const router = useRouter()
  const [selectedBarber, setSelectedBarber] = useState<Barber | null>(null)
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [isBooked, setIsBooked] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const timeSlots = useMemo(() => {
    if (!selectedDate) return []
    return generateTimeSlots(selectedDate)
  }, [selectedDate])

  const canBook = selectedBarber && selectedService && selectedDate && selectedTime

  const handleBook = async () => {
    if (!canBook) return
    
    if (!isLoggedIn) {
      router.push('/login')
      return
    }
    
    setIsLoading(true)
    setError(null)
    
    const result = await createAppointment({
      barberId: selectedBarber.id,
      barberName: selectedBarber.name,
      serviceId: selectedService.id,
      serviceName: selectedService.name,
      servicePrice: selectedService.price,
      serviceDuration: selectedService.duration,
      date: format(selectedDate, 'yyyy-MM-dd'),
      time: selectedTime,
    })
    
    if (result.success) {
      setIsBooked(true)
    } else {
      setError(result.error || 'Failed to book appointment')
    }
    
    setIsLoading(false)
  }

  const handleReset = () => {
    setSelectedBarber(null)
    setSelectedService(null)
    setSelectedDate(undefined)
    setSelectedTime(null)
    setIsBooked(false)
    setError(null)
  }

  if (isBooked) {
    return (
      <Card className="mx-auto max-w-lg text-center">
        <CardContent className="py-12">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <Check className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="mb-2 text-2xl font-bold">Запись подтверждена!</h2>
          <p className="mb-6 text-muted-foreground">
            Вы записаны к {selectedBarber?.name} на услугу {selectedService?.name} Дата {' '}
            {selectedDate && format(selectedDate, 'MMMM d, yyyy')} в  {selectedTime}.
          </p>
          <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
            <Button onClick={handleReset}>Записаться еще раз</Button>
            <Button variant="outline" onClick={() => router.push('/profile')}>
              Мои записи
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-8">
      {error && (
        <div className="flex items-center gap-2 rounded-lg bg-destructive/10 p-4 text-destructive">
          <AlertCircle className="h-5 w-5" />
          {error}
        </div>
      )}

      {/* Barbers Section */}
      <Card>
        <CardHeader>
          <CardTitle>Твой барбер</CardTitle>
          <CardDescription>Выбери мастера, которому доверишь свое кресло.</CardDescription>
        </CardHeader>
        <CardContent>
          {barbers.length === 0 ? (
            <p className="py-8 text-center text-muted-foreground">No barbers available</p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {barbers.map((barber) => (
                <BarberCard
                  key={barber.id}
                  barber={barber}
                  selected={selectedBarber?.id === barber.id}
                  onSelect={setSelectedBarber}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Services Section */}
      <Card>
        <CardHeader>
          <CardTitle>Выберите услугу</CardTitle>
          <CardDescription>Выберите нужную услугу</CardDescription>
        </CardHeader>
        <CardContent>
          {services.length === 0 ? (
            <p className="py-8 text-center text-muted-foreground">Нет доступных услуг</p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {services.map((service) => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  selected={selectedService?.id === service.id}
                  onSelect={setSelectedService}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Date & Time Section */}
      <Card>
        <CardHeader>
          <CardTitle>Выберите дату и время</CardTitle>
          <CardDescription>Выберите предпочитаемый слот для записи</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <label className="mb-2 block text-sm font-medium">Date</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    'w-full justify-start text-left font-normal sm:w-[280px]',
                    !selectedDate && 'text-muted-foreground'
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate ? format(selectedDate, 'PPP') : 'Pick a date'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => {
                    setSelectedDate(date)
                    setSelectedTime(null)
                  }}
                  disabled={(date) => {
                    const today = startOfDay(new Date())
                    const maxDate = addDays(today, 30)
                    return date < today || date > maxDate
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {selectedDate && (
            <div>
              <label className="mb-2 block text-sm font-medium">Доступные временные слоты</label>
              <TimeSlotPicker
                slots={timeSlots}
                selectedTime={selectedTime}
                onSelect={setSelectedTime}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Booking Summary */}
      {canBook && (
        <Card className="border-primary">
          <CardHeader>
            <CardTitle>Детали записи</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Barber</span>
                <span className="font-medium">{selectedBarber.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Service</span>
                <span className="font-medium">{selectedService.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Date</span>
                <span className="font-medium">{format(selectedDate, 'MMMM d, yyyy')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Time</span>
                <span className="font-medium">{selectedTime}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Duration</span>
                <span className="font-medium">{selectedService.duration} min</span>
              </div>
              <div className="mt-4 flex justify-between border-t pt-4">
                <span className="font-semibold">Total</span>
                <span className="text-xl font-bold">${selectedService.price}</span>
              </div>
            </div>
            <Button 
              className="mt-6 w-full" 
              size="lg" 
              onClick={handleBook}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Booking...
                </>
              ) : isLoggedIn ? (
                'Book Appointment'
              ) : (
                'Login to Book'
              )}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
