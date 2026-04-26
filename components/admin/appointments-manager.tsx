'use client'

import { useState } from 'react'
import { format, parseISO, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday, isSameMonth } from 'date-fns'
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { StoredAppointment } from '@/lib/types'
import { updateAppointmentStatus } from '@/app/actions/appointments'
import { cn } from '@/lib/utils'

interface AdminAppointmentsManagerProps {
  initialAppointments: StoredAppointment[]
}

export function AdminAppointmentsManager({ initialAppointments }: AdminAppointmentsManagerProps) {
  const [appointments, setAppointments] = useState(initialAppointments)
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd })

  const getAppointmentsForDate = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd')
    return appointments.filter(a => a.date === dateStr)
  }

  const selectedAppointments = selectedDate ? getAppointmentsForDate(selectedDate) : []

  const statusColors = {
    upcoming: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  }

  const handleStatusChange = async (id: string, status: 'upcoming' | 'completed' | 'cancelled') => {
    setUpdatingId(id)
    const result = await updateAppointmentStatus(id, status)
    if (result.success) {
      setAppointments(prev => 
        prev.map(a => a.id === id ? { ...a, status } : a)
      )
    }
    setUpdatingId(null)
  }

  return (
    <>
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Calendar */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>{format(currentMonth, 'MMMM yyyy')}</CardTitle>
            <div className="flex gap-1">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-1">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div key={day} className="p-2 text-center text-sm font-medium text-muted-foreground">
                  {day}
                </div>
              ))}
              {Array.from({ length: monthStart.getDay() }).map((_, i) => (
                <div key={`empty-${i}`} className="p-2" />
              ))}
              {days.map((day) => {
                const dayAppointments = getAppointmentsForDate(day)
                const hasAppointments = dayAppointments.length > 0
                const isSelected = selectedDate && isSameDay(day, selectedDate)

                return (
                  <button
                    key={day.toISOString()}
                    onClick={() => setSelectedDate(day)}
                    className={cn(
                      'relative flex h-12 flex-col items-center justify-center rounded-md p-2 text-sm transition-colors hover:bg-secondary',
                      isToday(day) && 'font-bold',
                      isSelected && 'bg-primary text-primary-foreground hover:bg-primary',
                      !isSameMonth(day, currentMonth) && 'text-muted-foreground'
                    )}
                  >
                    {format(day, 'd')}
                    {hasAppointments && (
                      <span className={cn(
                        'absolute bottom-1 h-1.5 w-1.5 rounded-full',
                        isSelected ? 'bg-primary-foreground' : 'bg-primary'
                      )} />
                    )}
                  </button>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Selected Date Appointments */}
        <Card>
          <CardHeader>
            <CardTitle>
              {selectedDate ? format(selectedDate, 'MMMM d, yyyy') : 'Выберите дату'}
            </CardTitle>
            <CardDescription>
              {selectedDate 
                ? `${selectedAppointments.length} appointment${selectedAppointments.length !== 1 ? 's' : ''}`
                : 'Выберите дату, чтобы увидеть записи'
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            {selectedDate ? (
              selectedAppointments.length > 0 ? (
                <div className="space-y-4">
                  {selectedAppointments.map((appointment) => (
                    <div key={appointment.id} className="rounded-lg border p-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium">{appointment.time}</p>
                          <p className="text-sm text-muted-foreground">{appointment.serviceName}</p>
                          <p className="text-sm text-muted-foreground">with {appointment.barberName}</p>
                          <p className="text-sm text-muted-foreground">Client: {appointment.userName}</p>
                        </div>
                        <Badge variant="secondary" className={statusColors[appointment.status]}>
                          {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="py-8 text-center text-muted-foreground">
                 На эту дату записей нет
                </p>
              )
            ) : (
              <p className="py-8 text-center text-muted-foreground">
                Выберите дату в календаре
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* All Appointments Table */}
      <Card>
        <CardHeader>
          <CardTitle>Все записи</CardTitle>
          <CardDescription>Полный список всех записей</CardDescription>
        </CardHeader>
        <CardContent>
          {appointments.length === 0 ? (
            <p className="py-8 text-center text-muted-foreground">
              Записей пока нет
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b text-left text-sm text-muted-foreground">
                    <th className="pb-3 font-medium">Date</th>
                    <th className="pb-3 font-medium">Time</th>
                    <th className="pb-3 font-medium">Client</th>
                    <th className="pb-3 font-medium">Barber</th>
                    <th className="pb-3 font-medium">Service</th>
                    <th className="pb-3 font-medium">Duration</th>
                    <th className="pb-3 font-medium">Status</th>
                    <th className="pb-3 text-right font-medium">Price</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map((appointment) => (
                    <tr key={appointment.id} className="border-b last:border-0">
                      <td className="py-3">{format(parseISO(appointment.date), 'MMM d, yyyy')}</td>
                      <td className="py-3">{appointment.time}</td>
                      <td className="py-3">{appointment.userName}</td>
                      <td className="py-3">{appointment.barberName}</td>
                      <td className="py-3">{appointment.serviceName}</td>
                      <td className="py-3">{appointment.serviceDuration} min</td>
                      <td className="py-3">
                        <Select 
                          value={appointment.status} 
                          onValueChange={(value) => handleStatusChange(appointment.id, value as 'upcoming' | 'completed' | 'cancelled')}
                          disabled={updatingId === appointment.id}
                        >
                          <SelectTrigger className="w-32">
                            {updatingId === appointment.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <SelectValue />
                            )}
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="upcoming">Ожидает</SelectItem>
                            <SelectItem value="completed">Завершено</SelectItem>
                            <SelectItem value="cancelled">Отменено</SelectItem>
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="py-3 text-right">${appointment.servicePrice}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  )
}
