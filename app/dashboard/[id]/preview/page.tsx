import { Suspense } from 'react'
import { WeddingPreview } from './wedding-preview'

export default async function PreviewPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return (
    <Suspense fallback={null}>
      <WeddingPreview id={id} />
    </Suspense>
  )
}