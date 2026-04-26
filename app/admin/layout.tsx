import { redirect } from 'next/navigation'
import { AdminSidebar } from '@/components/admin-sidebar'
import { getCurrentUser } from '@/app/actions/auth'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getCurrentUser()
  
  // Redirect if not logged in or not admin
  if (!user || user.role !== 'admin') {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminSidebar />
      <div className="pl-64">
        <main className="p-8">{children}</main>
      </div>
    </div>
  )
}
