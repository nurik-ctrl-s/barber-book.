import { getServices } from '@/app/actions/services'
import { ServicesManager } from '@/components/admin/services-manager'

export default async function AdminServicesPage() {
  const services = await getServices()

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Управление услугами</h1>
        <p className="mt-2 text-muted-foreground">
          Добавляйте, редактируйте или удаляйте предлагаемые услуги
        </p>
      </div>
      <ServicesManager initialServices={services} />
    </div>
  )
}
