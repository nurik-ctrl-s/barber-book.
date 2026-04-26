import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { TimeSlot } from '@/lib/types'

interface TimeSlotPickerProps {
  slots: TimeSlot[]
  selectedTime: string | null
  onSelect: (time: string) => void
}

export function TimeSlotPicker({ slots, selectedTime, onSelect }: TimeSlotPickerProps) {
  return (
    <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
      {slots.map((slot) => (
        <Button
          key={slot.time}
          variant={selectedTime === slot.time ? 'default' : 'outline'}
          size="sm"
          disabled={!slot.available}
          onClick={() => slot.available && onSelect(slot.time)}
          className={cn(
            'text-sm',
            !slot.available && 'opacity-50'
          )}
        >
          {slot.time}
        </Button>
      ))}
    </div>
  )
}
