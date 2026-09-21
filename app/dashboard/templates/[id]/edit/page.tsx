import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { AdminTemplateEditor } from './admin-template-editor'
import { getCurrentRole } from '@/lib/session'

export default async function EditTemplatePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams?: Promise<{ as?: string; role?: string }>
}) {
  const { id } = await params
  const query = await searchParams
  const role = await getCurrentRole()
  const isDirectAdmin = query?.as === 'admin' || query?.role === 'admin'

  if (role !== 'admin' && !isDirectAdmin) {
    redirect('/dashboard')
  }
  return (
    <Suspense fallback={null}>
      <AdminTemplateEditor id={id} />
    </Suspense>
  )
}
