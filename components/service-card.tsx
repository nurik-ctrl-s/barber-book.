import { Clock } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import type { Service } from '@/lib/types'

interface ServiceCardProps {
  service: Service
  selected: boolean
  onSelect: (service: Service) => void
}

export function ServiceCard({ service, selected, onSelect }: ServiceCardProps) {
  return (
    <Card 
      className={cn(
        'cursor-pointer transition-all hover:shadow-md',
        selected && 'ring-2 ring-primary'
      )}
      onClick={() => onSelect(service)}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold">{service.name}</h3>
            <p className="text-sm text-muted-foreground">{service.description}</p>
            <div className="mt-2 flex items-center gap-1 text-sm text-muted-foreground">
              <Clock className="h-3.5 w-3.5" />
              <span>{service.duration} min</span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xl font-bold">${service.price}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
