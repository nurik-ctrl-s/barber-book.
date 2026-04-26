'use client'

import { format, parseISO } from 'date-fns'
import { Calendar, Clock, User, DollarSign, X, Loader2 } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { StoredAppointment } from '@/lib/types'
import { updateAppointmentStatus } from '@/app/actions/appointments'

interface ProfileAppointmentCardProps {
  appointment: StoredAppointment
}

export function ProfileAppointmentCard({ appointment }: ProfileAppointmentCardProps) {
  const [isCancelling, setIsCancelling] = useState(false)
  
  const statusColors = {
    upcoming: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
    cancelled: 'bg-gray-100 text-gray-800',
  }

  const handleCancel = async () => {
    setIsCancelling(true)
    await updateAppointmentStatus(appointment.id, 'cancelled')
    setIsCancelling(false)
  }

  return (
    <div className="flex flex-col gap-4 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold">{appointment.serviceName}</h3>
          <Badge className={statusColors[appointment.status]} variant="secondary">
            {appointment.status}
          </Badge>
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <User className="h-3.5 w-3.5" />
            {appointment.barberName}
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" />
            {format(parseISO(appointment.date), 'MMM d, yyyy')}
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            {appointment.time}
          </div>
          <div className="flex items-center gap-1">
            <DollarSign className="h-3.5 w-3.5" />
            ${appointment.servicePrice}
          </div>
        </div>
      </div>
      {appointment.status === 'upcoming' && (
        <Button 
          variant="outline" 
          size="sm" 
          className="text-destructive hover:text-destructive"
          onClick={handleCancel}
          disabled={isCancelling}
        >
          {isCancelling ? (
            <Loader2 className="mr-1 h-4 w-4 animate-spin" />
          ) : (
            <X className="mr-1 h-4 w-4" />
          )}
          Cancel
        </Button>
      )}
    </div>
  )
}
