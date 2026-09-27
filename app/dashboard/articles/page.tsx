import { redirect } from 'next/navigation'
import { ArticleManager } from './article-manager'
import { getSessionUser } from '@/lib/session'

export const dynamic = 'force-dynamic'

/**
 * Trang quản lý bài viết Explore dành cho quản trị viên.
 * Xác thực quyền admin ở server trước khi render giao diện quản lý.
 */
export default async function ArticlesDashboardPage() {
  const user = await getSessionUser()

  if (!user) {
    redirect('/auth/login')
  }
  if (user.role !== 'admin') {
    redirect('/dashboard')
  }

  return <ArticleManager />
}
