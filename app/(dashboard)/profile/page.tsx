import { redirect } from 'next/navigation'
import Image from 'next/image'
import { Mail, Phone, Calendar } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { getCurrentUser } from '@/app/actions/auth'
import { getUserAppointments } from '@/app/actions/appointments'
import { ProfileAppointmentCard } from '@/components/profile-appointment-card'

export default async function ProfilePage() {
  const user = await getCurrentUser()
  
  if (!user) {
    redirect('/login')
  }
  
  const appointments = await getUserAppointments(user.id)
  const upcomingAppointments = appointments.filter(a => a.status === 'upcoming')
  const pastAppointments = appointments.filter(a => a.status === 'completed' || a.status === 'cancelled')

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Мой профиль</h1>
        <p className="mt-2 text-muted-foreground">
          Управляйте своим аккаунтом и просматривайте ваши записи
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* User Info Card */}
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="relative h-24 w-24 overflow-hidden rounded-full">
                  <Image
                    src={user.avatar}
                    alt={user.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <h2 className="mt-4 text-xl font-bold">{user.name}</h2>
                <p className="text-sm text-muted-foreground">Клиент с{user.memberSince}</p>
                
                <div className="mt-6 w-full space-y-3">
                  <div className="flex items-center gap-3 rounded-lg bg-secondary p-3">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{user.email}</span>
                  </div>
                  <div className="flex items-center gap-3 rounded-lg bg-secondary p-3">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{user.phone}</span>
                  </div>
                  <div className="flex items-center gap-3 rounded-lg bg-secondary p-3">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{appointments.length} Всего визитов</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Appointments */}
        <div className="space-y-8 lg:col-span-2">
          {/* Upcoming Appointments */}
          <Card>
            <CardHeader>
              <CardTitle>Ближайшие записи</CardTitle>
              <CardDescription>Забронированное время</CardDescription>
            </CardHeader>
            <CardContent>
              {upcomingAppointments.length > 0 ? (
                <div className="space-y-4">
                  {upcomingAppointments.map((appointment) => (
                    <ProfileAppointmentCard key={appointment.id} appointment={appointment} />
                  ))}
                </div>
              ) : (
                <p className="py-8 text-center text-muted-foreground">
                  Твоё кресло пока свободно
                </p>
              )}
            </CardContent>
          </Card>

          {/* Past Appointments */}
          <Card>
            <CardHeader>
              <CardTitle>Прошлые записи</CardTitle>
              <CardDescription>История ваших записей</CardDescription>
            </CardHeader>
            <CardContent>
              {pastAppointments.length > 0 ? (
                <div className="space-y-4">
                  {pastAppointments.map((appointment) => (
                    <ProfileAppointmentCard key={appointment.id} appointment={appointment} />
                  ))}
                </div>
              ) : (
                <p className="py-8 text-center text-muted-foreground">
                  Нет прошлых записей
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}
