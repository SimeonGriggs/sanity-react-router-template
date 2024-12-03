import {waitUntil} from '@vercel/functions'
import {handle} from 'hono/vercel'
import honoServer from './server'

export function GET() {
  const app = waitUntil(honoServer())
  return handle(app)
}

// const app = await honoServer()
// const handler = handle(app)

// export const GET = handler
// export const POST = handler
// export const PATCH = handler
// export const PUT = handler
// export const OPTIONS = handler
