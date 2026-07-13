import { useQuery } from '@/hooks/useQueryStore';
import { isWeb } from '@/utils/preview';
import type { QueryParams } from '@sanity/client';
import { isMaybePresentation } from '@sanity/presentation-comlink';
import { useLcapiLiveQuery, type LiveQueryResult } from './useLcapiLiveQuery';

/**
 * Web implementation of `useLiveQuery`.
 *
 * Two very different live-update mechanisms depending on context:
 *
 *  - INSIDE Presentation (the Studio iframe): delegate to React Loader's
 *    `useQuery` so that stega click-to-edit and `useLiveMode` (mounted in
 *    `SanityVisualEditing`) transparently take over data fetching and stream
 *    live/draft updates for the chosen perspective.
 *
 *  - OUTSIDE Presentation (a normal browser tab on e.g. localhost): use the
 *    Live Content API directly, exactly like native, so published changes show
 *    up live without a manual reload.
 */

function usePresentationQuery<T>(
  query: string,
  params: QueryParams = {},
): LiveQueryResult<T> {
  const { data, loading, error } = useQuery<T>(query, params);
  return { data, loading, error: error as Error | undefined };
}

// Presentation status is fixed for the lifetime of a page load (it depends on
// whether we're rendered in an iframe / popup), so we can pick the hook once at
// module load. This keeps the Rules of Hooks intact — the chosen hook is always
// the one that runs on every render.
const inPresentation =
  isWeb && typeof window !== 'undefined' && isMaybePresentation();

const useLiveQueryImpl = inPresentation ? usePresentationQuery : useLcapiLiveQuery;

export function useLiveQuery<T>(
  query: string,
  params: QueryParams = {},
): LiveQueryResult<T> {
  return useLiveQueryImpl<T>(query, params);
}

export type { LiveQueryResult };
export default useLiveQuery;
