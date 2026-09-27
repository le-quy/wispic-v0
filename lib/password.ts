import { randomBytes, scrypt, timingSafeEqual } from 'node:crypto'

const ALGORITHM = 'scrypt'
const KEY_LENGTH = 64
const COST = 16384
const BLOCK_SIZE = 8
const PARALLELIZATION = 1
const SALT_LENGTH = 16
const MAX_MEMORY = 64 * 1024 * 1024

function deriveKey(password: string, salt: Buffer, cost: number, blockSize: number, parallelization: number) {
  return new Promise<Buffer>((resolve, reject) => {
    scrypt(
      password.normalize('NFKC'),
      salt,
      KEY_LENGTH,
      { N: cost, r: blockSize, p: parallelization, maxmem: MAX_MEMORY },
      (err, key) => (err ? reject(err) : resolve(key))
    )
  })
}

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(SALT_LENGTH)
  const key = await deriveKey(password, salt, COST, BLOCK_SIZE, PARALLELIZATION)
  return [
    ALGORITHM,
    COST,
    BLOCK_SIZE,
    PARALLELIZATION,
    salt.toString('base64'),
    key.toString('base64'),
  ].join('$')
}

export async function verifyPassword(password: string, stored: string | null | undefined): Promise<boolean> {
  if (!stored) return false

  const parts = stored.split('$')
  if (parts.length !== 6) return false

  const [algorithm, costRaw, blockRaw, parallelRaw, saltRaw, keyRaw] = parts
  if (algorithm !== ALGORITHM) return false

  const cost = Number(costRaw)
  const blockSize = Number(blockRaw)
  const parallelization = Number(parallelRaw)
  if (!Number.isInteger(cost) || !Number.isInteger(blockSize) || !Number.isInteger(parallelization)) {
    return false
  }

  let expected: Buffer
  let actual: Buffer
  try {
    expected = Buffer.from(keyRaw, 'base64')
    actual = await deriveKey(password, Buffer.from(saltRaw, 'base64'), cost, blockSize, parallelization)
  } catch {
    return false
  }

  if (expected.length !== actual.length) return false
  return timingSafeEqual(expected, actual)
}

/**
 * Hash dùng để so sánh khi không tìm thấy user, để thời gian phản hồi
 * của login không tiết lộ email nào đã tồn tại.
 */
let dummyHashPromise: Promise<string> | null = null
export function getDummyHash(): Promise<string> {
  if (!dummyHashPromise) dummyHashPromise = hashPassword('wispic-dummy-password-never-valid')
  return dummyHashPromise
}
