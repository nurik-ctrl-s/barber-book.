import { getBarbers } from '@/app/actions/barbers'
import { BarbersManager } from '@/components/admin/barbers-manager'

export default async function AdminBarbersPage() {
  const barbers = await getBarbers()

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Управление мастерами</h1>
        <p className="mt-2 text-muted-foreground">
          Добавляйте, редактируйте или удаляйте мастеров из вашей команды
        </p>
      </div>
      <BarbersManager initialBarbers={barbers} />
    </div>
  )
}
