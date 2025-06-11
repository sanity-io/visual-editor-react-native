// app/components/SanityVisualEditing.tsx
import { useLiveMode } from '@/hooks/useQueryStore';
import { isWeb } from '@/utils/preview';
import { isMaybePresentation } from '@sanity/presentation-comlink';
import { enableVisualEditing } from '@sanity/visual-editing';
import { usePathname, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { client } from '../sanity/client';

// This component only has an effect in presentation mode on the web -- it provides clickable overlays of content that enable Visual Editing in the studio.
export default function SanityVisualEditing() {
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    const disable = isWeb && isMaybePresentation() ? enableVisualEditing({
      history: {
        // Handle user changes to the expo router pathname (e.g. clicking a link in the app) by updating the URL bar
        subscribe: (navigate) => {
          console.log('NAVIGATION EVENT:', {navigate, pathname})
          // We navigate to Expo Router's current pathname.
          navigate({
            type: 'push',
            url: pathname,
          })

          // Return cleanup function
          return () => {}
        },
        // Handle user changes to the contents of the Presentation modeURL bar by calling expo router functions
        update: (u: any) => {
          console.log('URL UPDATE:', u)
          switch (u.type) {
            case 'push':
              return router.push(u.url)
            case 'pop':
              return router.back()
            case 'replace':
              return router.replace(u.url)
            default:
              throw new Error(`Unknown update type: ${u.type}`)
          }
        }
      },
      zIndex: 1000,
      // Handle the refresh button in the Presentation mode URL bar. (show spinner for 1 sec, refresh doesn't do anything for client-side apps)
      refresh: (payload) => {
        console.log('REFRESH EVENT: ', payload)
        const { source } = payload
        if(source === 'manual') {
          return new Promise(resolve => setTimeout(() => resolve(undefined), 1_000))
        } else {
          return false
        }
      },
    }) : () => null
    return () => disable()
  }, [pathname])

  useLiveMode({client })

  return null
}


