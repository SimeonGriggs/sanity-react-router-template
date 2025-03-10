import type {Config} from '@react-router/dev/config'
import {vercelPreset} from '@vercel/react-router/vite'

declare module 'react-router' {
  interface Future {
    unstable_middleware: true
  }
}

export default {
  presets: [vercelPreset()],
  future: {
    unstable_middleware: true,
  },
} satisfies Config
