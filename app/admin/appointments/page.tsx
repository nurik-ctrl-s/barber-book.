import { getAppointments } from '@/app/actions/appointments'
import { AdminAppointmentsManager } from '@/components/admin/appointments-manager'

export default async function AdminAppointmentsPage() {
  const appointments = await getAppointments()

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Записи</h1>
        <p className="mt-2 text-muted-foreground">
         Просмотр и управление всеми записями
        </p>
      </div>
      <AdminAppointmentsManager initialAppointments={appointments} />
    </div>
  )
}
