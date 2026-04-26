import { DashboardHeader } from '@/components/dashboard-header'
import { getCurrentUser } from '@/app/actions/auth'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getCurrentUser()

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader user={user} />
      {children}
    </div>
  )
}
