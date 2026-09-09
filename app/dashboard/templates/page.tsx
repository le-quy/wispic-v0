import { redirect } from 'next/navigation'
import { TemplateManager } from './template-manager'
import { getSessionUser } from '@/lib/session'

export default async function TemplatesPage() {
  const user = await getSessionUser()
  if (user?.role !== 'admin') {
    redirect('/dashboard')
  }
  return <TemplateManager />
}
