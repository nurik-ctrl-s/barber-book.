'use client'

import { useState, useTransition } from 'react'
import Image from 'next/image'
import { Plus, Pencil, Trash2, Star, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { addBarber, updateBarber, deleteBarber } from '@/app/actions/barbers'
import type { Barber } from '@/lib/types'

interface BarbersManagerProps {
  initialBarbers: Barber[]
}

export function BarbersManager({ initialBarbers }: BarbersManagerProps) {
  const [barbers, setBarbers] = useState<Barber[]>(initialBarbers)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingBarber, setEditingBarber] = useState<Barber | null>(null)
  const [isPending, startTransition] = useTransition()
  const [formData, setFormData] = useState({
    name: '',
    specialty: '',
    experience: '',
  })

  const handleOpenDialog = (barber?: Barber) => {
    if (barber) {
      setEditingBarber(barber)
      setFormData({
        name: barber.name,
        specialty: barber.specialty,
        experience: barber.experience.toString(),
      })
    } else {
      setEditingBarber(null)
      setFormData({ name: '', specialty: '', experience: '' })
    }
    setIsDialogOpen(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    startTransition(async () => {
      if (editingBarber) {
        const updated = await updateBarber(editingBarber.id, {
          name: formData.name,
          specialty: formData.specialty,
          experience: parseInt(formData.experience),
        })
        if (updated) {
          setBarbers(barbers.map(b => b.id === editingBarber.id ? updated : b))
        }
      } else {
        const newBarber = await addBarber({
          name: formData.name,
          specialty: formData.specialty,
          experience: parseInt(formData.experience),
        })
        setBarbers([...barbers, newBarber])
      }
      
      setIsDialogOpen(false)
    })
  }

  const handleDelete = (id: string) => {
    startTransition(async () => {
      const success = await deleteBarber(id)
      if (success) {
        setBarbers(barbers.filter(b => b.id !== id))
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
              Добавить мастера
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingBarber ? 'Редактировать мастера' : 'Добавить мастера'}</DialogTitle>
              <DialogDescription>
                {editingBarber ? 'Обновите информацию о мастере' : 'Добавьте нового мастера в вашу команду'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Имя</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Введите имя мастера"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="specialty">Специализация</Label>
                <Input
                  id="specialty"
                  value={formData.specialty}
                  onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                  placeholder="e.g., Classic Cuts & Fades"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="experience">Опыт работы</Label>
                <Input
                  id="experience"
                  type="number"
                  min="0"
                  value={formData.experience}
                  onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                  placeholder="e.g., 5"
                  required
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Отмена
                </Button>
                <Button type="submit" disabled={isPending}>
                  {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {editingBarber ? 'Обновить' : 'Добавить'} Мастер
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {barbers.map((barber) => (
          <Card key={barber.id}>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="relative h-20 w-20 overflow-hidden rounded-full">
                  <Image
                    src={barber.photo}
                    alt={barber.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <h3 className="mt-4 font-semibold">{barber.name}</h3>
                <p className="text-sm text-muted-foreground">{barber.specialty}</p>
                <div className="mt-2 flex items-center gap-1">
                  <Star className="h-4 w-4 fill-accent text-accent" />
                  <span className="text-sm font-medium">{barber.rating}</span>
                  <span className="text-sm text-muted-foreground">
                    ({barber.reviewCount} Отзывы)
                  </span>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  {barber.experience} Опыт работы
                </p>
                <div className="mt-4 flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleOpenDialog(barber)} disabled={isPending}>
                    <Pencil className="mr-1 h-3.5 w-3.5" />
                    Редактировать
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-destructive" 
                    onClick={() => handleDelete(barber.id)}
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
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  )
}
