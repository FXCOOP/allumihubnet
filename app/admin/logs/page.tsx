import { prisma } from '@/lib/db'

const actionLabels: Record<string, string> = {
  'ban_user': 'חסימת משתמש',
  'unban_user': 'הסרת חסימה',
  'change_role': 'שינוי תפקיד',
  'delete_post': 'מחיקת פוסט',
  'delete_comment': 'מחיקת תגובה',
  'active_ad': 'אישור מודעה',
  'rejected_ad': 'דחיית מודעה',
  'paused_ad': 'השהיית מודעה',
}

const actionColors: Record<string, string> = {
  'ban_user': 'bg-red-100 text-red-700',
  'unban_user': 'bg-green-100 text-green-700',
  'change_role': 'bg-blue-100 text-blue-700',
  'delete_post': 'bg-orange-100 text-orange-700',
  'delete_comment': 'bg-yellow-100 text-yellow-700',
  'active_ad': 'bg-green-100 text-green-700',
  'rejected_ad': 'bg-red-100 text-red-700',
  'paused_ad': 'bg-gray-100 text-gray-700',
}

export default async function AdminLogsPage() {
  const logs = await prisma.adminLog.findMany({
    orderBy: { createdAt: 'desc' },
    take: 100,
    include: {
      admin: {
        select: {
          firstName: true,
          lastName: true,
          email: true,
          avatarUrl: true
        }
      }
    }
  })

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">לוג פעולות</h1>
        <p className="text-gray-600">היסטוריית פעולות מנהלים</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase">מנהל</th>
                <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase">פעולה</th>
                <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase">סוג</th>
                <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase">פרטים</th>
                <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase">תאריך</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {log.admin.avatarUrl ? (
                        <img
                          src={log.admin.avatarUrl}
                          alt=""
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-semibold">
                          {log.admin.firstName[0]}{log.admin.lastName[0]}
                        </div>
                      )}
                      <span className="text-sm font-medium text-gray-900">
                        {log.admin.firstName} {log.admin.lastName}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${actionColors[log.action] || 'bg-gray-100 text-gray-700'}`}>
                      {actionLabels[log.action] || log.action}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {log.targetType}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {log.details || '-'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(log.createdAt).toLocaleString('he-IL')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {logs.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            אין פעולות מתועדות
          </div>
        )}
      </div>
    </div>
  )
}
