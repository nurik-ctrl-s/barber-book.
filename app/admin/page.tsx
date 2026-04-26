import { format } from 'date-fns'
import { Users, Sparkles, CalendarDays, DollarSign } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { getBarbers } from '@/app/actions/barbers'
import { getServices } from '@/app/actions/services'
import { getAppointments } from '@/app/actions/appointments'

export default async function AdminDashboardPage() {
  const [barbers, services, appointments] = await Promise.all([
    getBarbers(),
    getServices(),
    getAppointments()
  ])

  const upcomingAppointments = appointments.filter(a => a.status === 'upcoming')
  const totalRevenue = appointments
    .filter(a => a.status === 'completed')
    .reduce((acc, a) => acc + a.servicePrice, 0)

  const stats = [
    {
      title: 'Всего мастеров',
      value: barbers.length.toString(),
      icon: Users,
      description: 'Мастера в штате',
    },
    {
      title: 'Услуги',
      value: services.length.toString(),
      icon: Sparkles,
      description: 'Предлагаемые услуги',
    },
    {
      title: 'Записи',
      value: upcomingAppointments.length.toString(),
      icon: CalendarDays,
      description: 'Предстоящие записи',
    },
    {
      title: 'Доход',
      value: '$' + totalRevenue.toString(),
      icon: DollarSign,
      description: 'На основе завершенных записей',
    },
  ]

  const today = format(new Date(), 'yyyy-MM-dd')
  const todayAppointments = appointments.filter(
    a => a.date === today && a.status === 'upcoming'
  )

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Панель управления</h1>
        <p className="mt-2 text-muted-foreground">
          Операционные показатели
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.description}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Today's Appointments */}
      <Card>
        <CardHeader>
          <CardTitle>{"Сегодняшние записи"}</CardTitle>
          <CardDescription>Записи, запланированные на сегодня</CardDescription>
        </CardHeader>
        <CardContent>
          {todayAppointments.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b text-left text-sm text-muted-foreground">
                    <th className="pb-3 font-medium">Time</th>
                    <th className="pb-3 font-medium">Client</th>
                    <th className="pb-3 font-medium">Barber</th>
                    <th className="pb-3 font-medium">Service</th>
                    <th className="pb-3 font-medium">Duration</th>
                    <th className="pb-3 text-right font-medium">Price</th>
                  </tr>
                </thead>
                <tbody>
                  {todayAppointments.map((appointment) => (
                    <tr key={appointment.id} className="border-b last:border-0">
                      <td className="py-3 font-medium">{appointment.time}</td>
                      <td className="py-3">{appointment.userName}</td>
                      <td className="py-3">{appointment.barberName}</td>
                      <td className="py-3">{appointment.serviceName}</td>
                      <td className="py-3">{appointment.serviceDuration} min</td>
                      <td className="py-3 text-right">${appointment.servicePrice}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="py-8 text-center text-muted-foreground">
              На сегодня записей нет
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
