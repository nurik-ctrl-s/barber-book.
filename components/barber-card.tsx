import Image from 'next/image'
import { Star } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import type { Barber } from '@/lib/types'

interface BarberCardProps {
  barber: Barber
  selected: boolean
  onSelect: (barber: Barber) => void
}

export function BarberCard({ barber, selected, onSelect }: BarberCardProps) {
  return (
    <Card 
      className={cn(
        'cursor-pointer transition-all hover:shadow-md',
        selected && 'ring-2 ring-primary'
      )}
      onClick={() => onSelect(barber)}
    >
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          <div className="relative h-16 w-16 overflow-hidden rounded-full">
            <Image
              src={barber.photo}
              alt={barber.name}
              fill
              className="object-cover"
            />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold">{barber.name}</h3>
            <p className="text-sm text-muted-foreground">{barber.specialty}</p>
            <div className="mt-1 flex items-center gap-2">
              <div className="flex items-center gap-1">
                <Star className="h-3.5 w-3.5 fill-accent text-accent" />
                <span className="text-sm font-medium">{barber.rating}</span>
              </div>
              <span className="text-sm text-muted-foreground">
                ({barber.reviewCount} reviews)
              </span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              {barber.experience} years experience
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
