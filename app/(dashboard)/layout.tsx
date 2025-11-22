import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import Sidebar from '@/components/layout/Sidebar'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen flex">
      <Sidebar user={session.user} />
      <main className="flex-1 p-6 mr-64">
        <div className="max-w-4xl mx-auto">{children}</div>
      </main>
    </div>
  )
}
