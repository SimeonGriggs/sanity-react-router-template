import {useQuery} from '@sanity/react-loader'
import {VisualEditing} from '@sanity/visual-editing/react-router'
import {lazy, Suspense} from 'react'
import {Outlet, useLocation, useOutletContext} from 'react-router'

import {Footer} from '~/components/Footer'
import {Header} from '~/components/Header'
import {Title} from '~/components/Title'
import {loadQuery} from '~/sanity/loader.server'
import {loadQueryOptions} from '~/sanity/loadQueryOptions.server'
import {HOME_QUERY} from '~/sanity/queries'
import type {HomeDocument} from '~/types/home'
import {homeZ} from '~/types/home'
import type {ThemePreference} from '~/types/themePreference'

import type {Route} from './+types/layout'

const SanityLiveMode = lazy(() =>
  import('~/components/SanityLiveMode').then((module) => ({
    default: module.SanityLiveMode,
  })),
)
const ExitPreview = lazy(() =>
  import('~/components/ExitPreview').then((module) => ({
    default: module.ExitPreview,
  })),
)

export const loader = async ({request}: Route.LoaderArgs) => {
  const {preview, options} = await loadQueryOptions(request.headers)

  // Content from Sanity used in the global layout
  const query = HOME_QUERY
  const params = {}
  const initial = await loadQuery<HomeDocument>(query, params, options).then(
    (res) => ({
      ...res,
      data: res.data ? homeZ.parse(res.data) : undefined,
    }),
  )

  return {
    initial,
    query,
    params,
    sanity: {preview},
  }
}

export default function Website({loaderData}: Route.ComponentProps) {
  const {initial, query, params, sanity} = loaderData
  const {data: home} = useQuery<typeof initial.data>(query, params, {initial})
  const {pathname} = useLocation()
  const context = useOutletContext<{theme: ThemePreference} | null>()
  const theme = context ? context.theme : 'light'

  return (
    <>
      <Header home={home} theme={theme} />
      <div className="container mx-auto p-4 lg:p-12 grid grid-cols-1 gap-4 lg:gap-12">
        {home?.title && pathname === '/' ? <Title>{home?.title}</Title> : null}
        <Outlet />
      </div>
      <Footer home={home} />
      {sanity.preview ? (
        <Suspense>
          <SanityLiveMode />
          <ExitPreview />
          <VisualEditing />
        </Suspense>
      ) : null}
    </>
  )
}
