import { createImageUrlBuilder } from '@sanity/image-url'
import type { SanityImageSource } from '@sanity/image-url'
import { client } from '../sanity/client'

const builder = createImageUrlBuilder(client)

export function urlFor(source: SanityImageSource) {
  if(!source) return null
  try {
    return builder.image(source)
  } catch (error) {
    console.error(error)
    return null
  }
}