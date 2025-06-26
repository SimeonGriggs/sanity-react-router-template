import type {MetaFunction} from 'react-router'

import {Hydrated} from '~/components/Hydrated'
import {SanityStudio} from '~/components/SanityStudio'
import '~/styles/studio.css'

export const meta: MetaFunction = () => [
  {title: 'Sanity Studio'},
  {name: 'robots', content: 'noindex'},
]

export default function StudioPage() {
  return (
    <Hydrated>
      <SanityStudio />
    </Hydrated>
  )
}
