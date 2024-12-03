import {handle} from 'hono/vercel'
import honoServer from './server'

const app = await honoServer()
const handler = handle(app)

export const GET = handler
export const POST = handler
export const PATCH = handler
export const PUT = handler
export const OPTIONS = handler
