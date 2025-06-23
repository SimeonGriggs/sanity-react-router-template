import {useQuery} from '@sanity/react-loader'

import {Record} from '~/components/Record'
import {OG_IMAGE_HEIGHT, OG_IMAGE_WIDTH} from '~/routes/resource/og'
import {client} from '~/sanity/client'
import {loadQuery} from '~/sanity/loader.server'
import {loadQueryOptions} from '~/sanity/loadQueryOptions.server'
import {RECORD_QUERY} from '~/sanity/queries'
import {type RecordDocument, recordZ} from '~/types/record'

import type {Route} from './+types/$slug'

export const meta: Route.MetaFunction = ({data, matches}: Route.MetaArgs) => {
  const layoutData = matches.find(
    (match) => match?.id === `routes/website/layout`,
  )?.data
  const home = layoutData ? layoutData?.initial?.data : null
  const title = [data?.initial?.data?.title, home?.siteTitle]
    .filter(Boolean)
    .join(' | ')
  const ogImageUrl = data ? data.ogImageUrl : null

  return [
    {title},
    {property: 'twitter:card', content: 'summary_large_image'},
    {property: 'twitter:title', content: title},
    {property: 'og:title', content: title},
    {property: 'og:image:width', content: String(OG_IMAGE_WIDTH)},
    {property: 'og:image:height', content: String(OG_IMAGE_HEIGHT)},
    {property: 'og:image', content: ogImageUrl},
  ]
}

// Perform a `like` or `dislike` mutation on a `record` document
export const action = async ({request}: Route.ActionArgs) => {
  if (request.method !== 'POST') {
    throw new Response('Method not allowed', {status: 405})
  }

  const writeClient = client.withConfig({
    useCdn: false,
    token: process.env.SANITY_WRITE_TOKEN,
  })
  const {token, projectId} = writeClient.config()

  if (!token) {
    throw new Response(
      `Setup "SANITY_WRITE_TOKEN" with a token with "Editor" permissions to your environment variables. Create one at https://sanity.io/manage/project/${projectId}/api#tokens`,
      {status: 401},
    )
  }

  const body = await request.formData()
  const id = String(body.get('id'))
  const action = String(body.get('action'))

  if (id) {
    switch (action) {
      case 'LIKE':
        return await writeClient
          .patch(id)
          .setIfMissing({likes: 0})
          .inc({likes: 1})
          .commit()
          .then(({likes, dislikes}) => ({
            likes: likes ?? 0,
            dislikes: dislikes ?? 0,
          }))
      case 'DISLIKE':
        return await writeClient
          .patch(id)
          .setIfMissing({dislikes: 0})
          .inc({dislikes: 1})
          .commit()
          .then(({likes, dislikes}) => ({
            likes: likes ?? 0,
            dislikes: dislikes ?? 0,
          }))
      default:
        throw new Response('Bad action', {status: 400})
    }
  }

  throw new Response('Bad request', {status: 400})
}

// Load the `record` document with this slug
export const loader = async ({params, request}: Route.LoaderArgs) => {
  const {options} = await loadQueryOptions(request.headers)

  const query = RECORD_QUERY
  const initial = await loadQuery<RecordDocument>(
    query,
    // $slug.tsx has the params { slug: 'hello-world' }
    params,
    options,
  ).then((res) => ({...res, data: res.data ? recordZ.parse(res.data) : null}))

  if (!initial.data) {
    throw new Response('Not found', {status: 404})
  }

  // Create social share image url
  const {origin} = new URL(request.url)
  const ogImageUrl = `${origin}/resource/og?id=${initial.data._id}`

  return {
    initial,
    query,
    params,
    ogImageUrl,
  }
}

export default function RecordPage({loaderData}: Route.ComponentProps) {
  const {initial, query, params} = loaderData
  const {data} = useQuery(query, params, {initial})

  return data ? <Record data={data} /> : null
}
