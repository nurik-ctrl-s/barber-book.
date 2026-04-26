'use client'

import { useState, useTransition } from 'react'
import { Plus, Pencil, Trash2, Clock, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { addService, updateService, deleteService } from '@/app/actions/services'
import type { Service } from '@/lib/types'

interface ServicesManagerProps {
  initialServices: Service[]
}

export function ServicesManager({ initialServices }: ServicesManagerProps) {
  const [services, setServices] = useState<Service[]>(initialServices)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingService, setEditingService] = useState<Service | null>(null)
  const [isPending, startTransition] = useTransition()
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    duration: '',
  })

  const handleOpenDialog = (service?: Service) => {
    if (service) {
      setEditingService(service)
      setFormData({
        name: service.name,
        description: service.description,
        price: service.price.toString(),
        duration: service.duration.toString(),
      })
    } else {
      setEditingService(null)
      setFormData({ name: '', description: '', price: '', duration: '' })
    }
    setIsDialogOpen(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    startTransition(async () => {
      if (editingService) {
        const updated = await updateService(editingService.id, {
          name: formData.name,
          description: formData.description,
          price: parseInt(formData.price),
          duration: parseInt(formData.duration),
        })
        if (updated) {
          setServices(services.map(s => s.id === editingService.id ? updated : s))
        }
      } else {
        const newService = await addService({
          name: formData.name,
          description: formData.description,
          price: parseInt(formData.price),
          duration: parseInt(formData.duration),
        })
        setServices([...services, newService])
      }
      
      setIsDialogOpen(false)
    })
  }

  const handleDelete = (id: string) => {
    startTransition(async () => {
      const success = await deleteService(id)
      if (success) {
        setServices(services.filter(s => s.id !== id))
      }
    })
  }

  return (
    <>
      <div className="flex justify-end">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="mr-2 h-4 w-4" />
              Добавить услугу
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingService ? 'Edit Service' : 'Создание новой услуги'}</DialogTitle>
              <DialogDescription>
                {editingService ? 'Update service information' : 'Добавьте новую услугу в ваш прайс-лист'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Название услуги</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Моделирование бороды"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Описание</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Опишите услугу..."
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Цена ($)</Label>
                  <Input
                    id="price"
                    type="number"
                    min="0"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="30"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration">Длительность.(min)</Label>
                  <Input
                    id="duration"
                    type="number"
                    min="0"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    placeholder="30"
                    required
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Отмена
                </Button>
                <Button type="submit" disabled={isPending}>
                  {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {editingService ? 'Обновить' : 'Добавить'} Услугу
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => (
          <Card key={service.id}>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold">{service.name}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{service.description}</p>
                  <div className="mt-3 flex items-center gap-1 text-sm text-muted-foreground">
                    <Clock className="h-3.5 w-3.5" />
                    <span>{service.duration} min</span>
                  </div>
                </div>
                <span className="text-xl font-bold">${service.price}</span>
              </div>
              <div className="mt-4 flex gap-2">
                <Button variant="outline" size="sm" onClick={() => handleOpenDialog(service)} disabled={isPending}>
                  <Pencil className="mr-1 h-3.5 w-3.5" />
                 Редактировать
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-destructive" 
                  onClick={() => handleDelete(service.id)}
                  disabled={isPending}
                >
                  {isPending ? (
                    <Loader2 className="mr-1 h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Trash2 className="mr-1 h-3.5 w-3.5" />
                  )}
                Удалить
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  )
}
