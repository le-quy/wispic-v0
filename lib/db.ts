import { Pool, type PoolClient, type QueryResultRow } from 'pg'

function createPool(): Pool {
  const connectionString = process.env.DATABASE_URL
  const hasCustomHost = !!process.env.DB_HOST && process.env.DB_HOST !== 'localhost'

  if (!connectionString && !hasCustomHost) {
    throw new Error(
      '[wispic] Thiếu cấu hình database. Đặt DATABASE_URL hoặc DB_HOST/DB_PORT/DB_NAME/DB_USER/DB_PASSWORD trong .env'
    )
  }

  return new Pool(
    connectionString
      ? { connectionString }
      : {
          host: process.env.DB_HOST,
          port: parseInt(process.env.DB_PORT || '5432'),
          database: process.env.DB_NAME || 'wicpic',
          user: process.env.DB_USER || 'postgres',
          password: process.env.DB_PASSWORD || '',
        }
  )
}

const globalForDb = globalThis as unknown as { wispicPool?: Pool }

export const pool: Pool = globalForDb.wispicPool ?? createPool()

if (process.env.NODE_ENV !== 'production') {
  globalForDb.wispicPool = pool
}

pool.on('error', (err) => {
  console.error('[wispic] PostgreSQL idle client error:', err.message)
})

export function query<T extends QueryResultRow = QueryResultRow>(
  text: string,
  params?: unknown[]
): Promise<{ rows: T[]; rowCount: number | null }> {
  return pool.query<T>(text, params as never[])
}

/**
 * Chạy nhiều query trong một transaction. Bắt buộc dùng cho các thao tác
 * ghi nhiều bảng liên quan (ví dụ PUT /api/weddings/[id]) để lỗi giữa
 * chừng không để lại dữ liệu nửa vời.
 */
export async function withTransaction<T>(fn: (client: PoolClient) => Promise<T>): Promise<T> {
  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    const result = await fn(client)
    await client.query('COMMIT')
    return result
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
  }
}

export default pool
