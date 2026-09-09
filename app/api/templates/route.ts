import { NextResponse } from 'next/server'
import pool from '@/lib/db'

export async function GET() {
  try {
    const { rows } = await pool.query(
      `SELECT * FROM templates ORDER BY created_at ASC`
    )
    return NextResponse.json(rows.map(mapRowToTemplate))
  } catch (error) {
    console.error('GET /api/templates error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, category, description, swatches, accent, html, css, isCustom } = body

    const { rows: [row] } = await pool.query(
      `INSERT INTO templates (name, category, description, swatches, accent, html, css, is_custom)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [name, category, description, JSON.stringify(swatches || ["#f7f3ee", "#302b27"]), accent, html, css, isCustom || false]
    )

    return NextResponse.json(mapRowToTemplate(row), { status: 201 })
  } catch (error) {
    console.error('POST /api/templates error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

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
    isCustom: row.is_custom,
    createdAt: new Date(row.created_at).getTime(),
    updatedAt: new Date(row.updated_at).getTime(),
  }
}