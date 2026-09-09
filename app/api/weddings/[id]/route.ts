import { NextResponse } from 'next/server'
import pool from '@/lib/db'

async function fetchWedding(id: string) {
  const { rows } = await pool.query(
    `SELECT 
      w.*,
      COALESCE((SELECT json_agg(json_build_object('id', wp.id, 'url', wp.url, 'alt', wp.alt, 'sort_order', wp.sort_order) ORDER BY wp.sort_order) FROM wedding_photos wp WHERE wp.wedding_id = w.id), '[]') as photos,
      COALESCE((SELECT json_agg(json_build_object('id', rq.id, 'text', rq.text, 'type', rq.type) ORDER BY rq.sort_order) FROM rsvp_questions rq WHERE rq.wedding_id = w.id), '[]') as rsvp_questions,
      COALESCE((SELECT json_agg(json_build_object('id', ga.id, 'bank_name', ga.bank_name, 'account_number', ga.account_number, 'holder_name', ga.holder_name, 'qr_url', ga.qr_url) ORDER BY ga.sort_order) FROM gift_accounts ga WHERE ga.wedding_id = w.id), '[]') as gift_accounts,
      COALESCE((SELECT json_agg(json_build_object('id', te.id, 'time', te.time, 'title', te.title) ORDER BY te.sort_order) FROM timeline_events te WHERE te.wedding_id = w.id), '[]') as timeline_events,
      COALESCE((SELECT json_agg(dc.color ORDER BY dc.sort_order) FROM dress_code_colors dc WHERE dc.wedding_id = w.id), '[]') as dress_code_colors,
      COALESCE((SELECT json_agg(json_build_object('id', gq.id, 'text', gq.text, 'type', gq.type) ORDER BY gq.sort_order) FROM guestbook_questions gq WHERE gq.wedding_id = w.id), '[]') as guestbook_questions
    FROM weddings w WHERE w.id = $1`,
    [id]
  )
  return rows[0] || null
}

function mapRowToWedding(row: any) {
  if (!row) return null
  return {
    id: row.id,
    userId: row.user_id,
    templateId: row.template_id,
    title: row.title,
    status: row.status,
    groom: row.groom,
    bride: row.bride,
    groomParents: row.groom_parents,
    brideParents: row.bride_parents,
    weddingDate: row.wedding_date,
    ceremony: typeof row.ceremony === 'string' ? JSON.parse(row.ceremony) : row.ceremony,
    reception: typeof row.reception === 'string' ? JSON.parse(row.reception) : row.reception,
    location: typeof row.location === 'string' ? JSON.parse(row.location) : row.location,
    introduction: row.introduction,
    coupleStory: row.couple_story,
    avatar: row.avatar_url ? { id: 'avatar', url: row.avatar_url, alt: row.avatar_alt || '' } : null,
    couplePhoto: row.couple_photo_url ? { id: 'couple', url: row.couple_photo_url, alt: row.couple_photo_alt || '' } : null,
    photos: (row.photos || []).map((p: any) => ({ id: p.id, url: p.url, alt: p.alt || '' })),
    rsvp: {
      enabled: row.rsvp_enabled,
      displayMode: row.rsvp_display_mode,
      maxGuestCount: row.rsvp_max_guest_count,
      questions: (row.rsvp_questions || []).map((q: any) => ({ id: q.id, text: q.text, type: q.type })),
    },
    gift: {
      enabled: row.gift_enabled,
      displayMode: row.gift_display_mode,
      title: row.gift_title,
      accounts: (row.gift_accounts || []).map((a: any) => ({
        id: a.id,
        bankName: a.bank_name,
        accountNumber: a.account_number,
        holderName: a.holder_name,
        qrUrl: a.qr_url,
      })),
    },
    timeline: (row.timeline_events || []).map((t: any) => ({ id: t.id, time: t.time, title: t.title })),
    dressCode: {
      enabled: row.dress_code_enabled,
      title: row.dress_code_title,
      subtitle: row.dress_code_subtitle,
      colors: row.dress_code_colors || [],
    },
    music: {
      enabled: row.music_enabled,
      url: row.music_url,
      title: row.music_title,
    },
    guestbook: {
      enabled: row.guestbook_enabled,
      questions: (row.guestbook_questions || []).map((q: any) => ({ id: q.id, text: q.text, type: q.type })),
    },
    envelope: { greeting: row.envelope_greeting },
    og: { style: row.og_style, customUrl: row.og_custom_url },
    map: { embedUrl: row.map_embed_url, address: row.map_address },
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
    const row = await fetchWedding(id)
    if (!row) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(mapRowToWedding(row))
  } catch (error) {
    console.error('GET /api/weddings/[id] error:', error)
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
    const {
      templateId, title, status,
      groom, bride, groomParents, brideParents, weddingDate,
      ceremony, reception, location,
      introduction, coupleStory,
      avatar, couplePhoto, photos,
      rsvp, gift, timeline, dressCode, music, guestbook, envelope, og, map,
    } = body

    await pool.query(
      `UPDATE weddings SET
        template_id = $1, title = $2, status = $3,
        groom = $4, bride = $5, groom_parents = $6, bride_parents = $7, wedding_date = $8,
        ceremony = $9, reception = $10, location = $11,
        introduction = $12, couple_story = $13,
        avatar_url = $14, avatar_alt = $15, couple_photo_url = $16, couple_photo_alt = $17,
        rsvp_enabled = $18, rsvp_display_mode = $19, rsvp_max_guest_count = $20,
        gift_enabled = $21, gift_display_mode = $22, gift_title = $23,
        dress_code_enabled = $24, dress_code_title = $25, dress_code_subtitle = $26,
        music_enabled = $27, music_url = $28, music_title = $29,
        guestbook_enabled = $30, envelope_greeting = $31,
        og_style = $32, og_custom_url = $33,
        map_embed_url = $34, map_address = $35,
        updated_at = NOW()
      WHERE id = $36`,
      [
        templateId, title, status,
        groom, bride, groomParents, brideParents, weddingDate,
        JSON.stringify(ceremony), JSON.stringify(reception), JSON.stringify(location),
        introduction, coupleStory,
        avatar?.url || null, avatar?.alt || '',
        couplePhoto?.url || null, couplePhoto?.alt || '',
        rsvp?.enabled, rsvp?.displayMode, rsvp?.maxGuestCount,
        gift?.enabled, gift?.displayMode, gift?.title,
        dressCode?.enabled, dressCode?.title, dressCode?.subtitle,
        music?.enabled, music?.url || '', music?.title || '',
        guestbook?.enabled, envelope?.greeting,
        og?.style, og?.customUrl || '',
        map?.embedUrl || '', map?.address || '',
        id,
      ],
    )

    // Delete & re-insert sub-tables
    await pool.query('DELETE FROM wedding_photos WHERE wedding_id = $1', [id])
    await pool.query('DELETE FROM rsvp_questions WHERE wedding_id = $1', [id])
    await pool.query('DELETE FROM gift_accounts WHERE wedding_id = $1', [id])
    await pool.query('DELETE FROM timeline_events WHERE wedding_id = $1', [id])
    await pool.query('DELETE FROM dress_code_colors WHERE wedding_id = $1', [id])
    await pool.query('DELETE FROM guestbook_questions WHERE wedding_id = $1', [id])

    if (photos?.length) {
      for (let i = 0; i < photos.length; i++) {
        await pool.query(
          'INSERT INTO wedding_photos (wedding_id, url, alt, sort_order) VALUES ($1, $2, $3, $4)',
          [id, photos[i].url, photos[i].alt || '', i]
        )
      }
    }

    if (rsvp?.questions?.length) {
      for (let i = 0; i < rsvp.questions.length; i++) {
        await pool.query(
          'INSERT INTO rsvp_questions (wedding_id, text, type, sort_order) VALUES ($1, $2, $3, $4)',
          [id, rsvp.questions[i].text, rsvp.questions[i].type, i]
        )
      }
    }

    if (gift?.accounts?.length) {
      for (let i = 0; i < gift.accounts.length; i++) {
        await pool.query(
          'INSERT INTO gift_accounts (wedding_id, bank_name, account_number, holder_name, qr_url, sort_order) VALUES ($1, $2, $3, $4, $5, $6)',
          [id, gift.accounts[i].bankName, gift.accounts[i].accountNumber, gift.accounts[i].holderName, gift.accounts[i].qrUrl || '', i]
        )
      }
    }

    if (timeline?.length) {
      for (let i = 0; i < timeline.length; i++) {
        await pool.query(
          'INSERT INTO timeline_events (wedding_id, time, title, sort_order) VALUES ($1, $2, $3, $4)',
          [id, timeline[i].time, timeline[i].title, i]
        )
      }
    }

    if (dressCode?.colors?.length) {
      for (let i = 0; i < dressCode.colors.length; i++) {
        await pool.query(
          'INSERT INTO dress_code_colors (wedding_id, color, sort_order) VALUES ($1, $2, $3)',
          [id, dressCode.colors[i], i]
        )
      }
    }

    if (guestbook?.questions?.length) {
      for (let i = 0; i < guestbook.questions.length; i++) {
        await pool.query(
          'INSERT INTO guestbook_questions (wedding_id, text, type, sort_order) VALUES ($1, $2, $3, $4)',
          [id, guestbook.questions[i].text, guestbook.questions[i].type, i]
        )
      }
    }

    const row = await fetchWedding(id)
    return NextResponse.json(mapRowToWedding(row))
  } catch (error) {
    console.error('PUT /api/weddings/[id] error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { rowCount } = await pool.query('DELETE FROM weddings WHERE id = $1', [id])
    if (!rowCount) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('DELETE /api/weddings/[id] error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
