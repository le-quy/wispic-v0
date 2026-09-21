import { NextResponse } from 'next/server'
import pool from '@/lib/db'

function mapRowToTemplate(row: any) {
  return {
    id: row.id,
    name: row.name,
    category: row.category,
    description: row.description,
    swatches: typeof row.swatches === 'string' ? JSON.parse(row.swatches) : row.swatches,
    accent: row.accent,
    html: row.html,
    css: row.css,
    sections: typeof row.sections === 'string' ? JSON.parse(row.sections) : (Array.isArray(row.sections) ? row.sections : []),
    isCustom: row.is_custom,
    createdAt: new Date(row.created_at).getTime(),
    updatedAt: new Date(row.updated_at).getTime(),
  }
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { rows } = await pool.query('SELECT * FROM templates WHERE id = $1', [id])
    if (!rows[0]) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(mapRowToTemplate(rows[0]))
  } catch (error) {
    console.error('GET /api/templates/[id] error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { name, category, description, swatches, accent, html, css, sections, isCustom } = body

    const { rows } = await pool.query(
      `UPDATE templates SET
        name = $1, category = $2, description = $3, swatches = $4, accent = $5,
        html = $6, css = $7, sections = $8, is_custom = $9, updated_at = NOW()
       WHERE id = $10 RETURNING *`,
      [name, category, description, JSON.stringify(swatches), accent, html, css, JSON.stringify(sections || []), isCustom, id]
    )
    if (!rows[0]) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(mapRowToTemplate(rows[0]))
  } catch (error) {
    console.error('PUT /api/templates/[id] error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { rowCount } = await pool.query('DELETE FROM templates WHERE id = $1', [id])
    if (!rowCount) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('DELETE /api/templates/[id] error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}