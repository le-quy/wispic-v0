import { redirect } from 'next/navigation'
import { TemplateManager } from './template-manager'
import { getSessionUser } from '@/lib/session'

/**
 * Quyền admin được kiểm tra ở server từ session. Trước đây `?as=admin` /
 * `?role=admin` bypass được trang này.
 */
export default async function TemplatesPage() {
  const user = await getSessionUser()

  if (!user) {
    redirect('/auth/login')
  }
  if (user.role !== 'admin') {
    redirect('/dashboard')
  }
  return <TemplateManager />
}
