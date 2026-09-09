import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { AdminTemplateEditor } from './admin-template-editor'
import { getCurrentRole } from '@/lib/supabase/server'

export default async function EditTemplatePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const role = await getCurrentRole()
  if (role !== 'admin') {
    redirect('/dashboard')
  }
  return (
    <Suspense fallback={null}>
      <AdminTemplateEditor id={id} />
    </Suspense>
  )
}
