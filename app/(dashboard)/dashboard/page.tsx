import { BookingForm } from '@/components/booking-form'
import { getBarbers } from '@/app/actions/barbers'
import { getServices } from '@/app/actions/services'
import { getCurrentUser } from '@/app/actions/auth'

export default async function DashboardPage() {
  const [barbers, services, user] = await Promise.all([
    getBarbers(),
    getServices(),
    getCurrentUser()
  ])

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Занять кресло</h1>
        <p className="mt-2 text-muted-foreground">
          Определись с мастером, выбери услугу и удобное окно в графике.
        </p>
      </div>
      <BookingForm barbers={barbers} services={services} isLoggedIn={!!user} />
    </main>
  )
}
