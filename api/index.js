// import {handle} from 'hono/vercel'
// import honoServer from './server'

// const app = await honoServer()
import {Hono} from 'hono'
import {handle} from 'hono/vercel'

const app = new Hono().basePath('/')

app.get('/', (c) => {
  return c.json({message: "Congrats! You've deployed Hono to Vercel"})
})

const handler = handle(app)

export const GET = handler
export const POST = handler
export const PATCH = handler
export const PUT = handler
export const OPTIONS = handler
