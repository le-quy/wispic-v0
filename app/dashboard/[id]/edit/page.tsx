import { Suspense } from 'react'
import { WeddingEditor } from './wedding-editor'

export default async function EditPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return (
    <Suspense fallback={null}>
      <WeddingEditor id={id} />
    </Suspense>
  )
}