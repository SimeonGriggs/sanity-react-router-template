import type {Config} from '@react-router/dev/config'
import {vercelPreset} from '@vercel/react-router/vite'
import type {Future} from 'react-router'

declare module 'react-router' {
  interface Future {
    unstable_middleware: true // 👈 Enable middleware types
  }
}
export default {
  presets: [vercelPreset()],
  future: {
    unstable_middleware: true,
  },
} satisfies Config
