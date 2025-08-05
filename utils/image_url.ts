import imageUrlBuilder from '@sanity/image-url'
import { SanityImageSource } from '@sanity/image-url/lib/types/types'
import { client } from '../sanity/client'

const builder = imageUrlBuilder(client)

export function urlFor(source: SanityImageSource) {
  if(!source) return null
  try {
    return builder.image(source)
  } catch (error) {
    console.error(error)
    return null
  }
}