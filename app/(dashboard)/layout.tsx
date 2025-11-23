import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import Navbar from '@/components/layout/Navbar'
import LeftSidebar from '@/components/layout/LeftSidebar'
import RightSidebar from '@/components/layout/RightSidebar'

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
    <div className="min-h-screen bg-gray-50">
      <Navbar user={session.user} />
      <div className="max-w-7xl mx-auto px-6 pt-20 pb-6">
        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr_300px] gap-6">
          <LeftSidebar user={session.user} />
          <main className="min-w-0">{children}</main>
          <RightSidebar />
        </div>
      </div>
    </div>
  )
}
