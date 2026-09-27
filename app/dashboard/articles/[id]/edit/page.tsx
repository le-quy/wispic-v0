import { redirect } from 'next/navigation'
import { ArticleEditor } from './article-editor'
import { getSessionUser } from '@/lib/session'

export const dynamic = 'force-dynamic'

export default async function ArticleEditPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const user = await getSessionUser()

  if (!user) {
    redirect('/auth/login')
  }
  if (user.role !== 'admin') {
    redirect('/dashboard')
  }

  const { id } = await params
  return <ArticleEditor id={id} />
}
