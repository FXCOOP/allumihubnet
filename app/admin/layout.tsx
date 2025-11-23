import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import AdminSidebar from '@/components/admin/AdminSidebar'
import AdminHeader from '@/components/admin/AdminHeader'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/login')
  }

  // Check if user has admin privileges
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { systemRole: true, firstName: true, lastName: true, email: true, avatarUrl: true }
  })

  if (!user || !['admin', 'super_admin', 'moderator'].includes(user.systemRole)) {
    redirect('/feed')
  }

  return (
    <div className="min-h-screen bg-gray-100" dir="rtl">
      <AdminSidebar userRole={user.systemRole} />
      <div className="lg:mr-64">
        <AdminHeader user={user} />
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
