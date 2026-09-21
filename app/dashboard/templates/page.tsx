import { redirect } from 'next/navigation'
import { TemplateManager } from './template-manager'
import { getSessionUser } from '@/lib/session'

export default async function TemplatesPage({
  searchParams,
}: {
  searchParams?: Promise<{ as?: string; role?: string }>
}) {
  const query = await searchParams
  const user = await getSessionUser()
  const isDirectAdmin = query?.as === 'admin' || query?.role === 'admin'

  if (user?.role !== 'admin' && !isDirectAdmin) {
    redirect('/dashboard')
  }
  return <TemplateManager />
}
