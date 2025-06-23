import {Studio} from 'sanity'

import config from '../../sanity.config'

export function SanityStudio() {
  return (
    <Studio
      config={config}
      // To enable guests view-only access to your Studio,
      // uncomment this line!
      // unstable_noAuthBoundary
    />
  )
}
