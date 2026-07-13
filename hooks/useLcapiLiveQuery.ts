import { client } from '@/sanity/client';
import type { QueryParams, SyncTag } from '@sanity/client';
import { useEffect, useRef, useState } from 'react';

export interface LiveQueryResult<T> {
  data: T | undefined;
  loading: boolean;
  error: Error | undefined;
}

/**
 * Live-updating GROQ query backed directly by the Sanity Live Content API.
 *
 * Works on any platform that has `client.live.events()` (native iOS/Android via
 * the XHR EventSource polyfill, and web browsers via native EventSource). It:
 *   1. fetches the query and remembers the `syncTags` it returns,
 *   2. subscribes to `client.live.events()`, and
 *   3. refetches whenever a live event's tags overlap the stored tags
 *      (and on stream `restart`/`reconnect`).
 *
 * This is the implementation used everywhere EXCEPT inside Presentation mode,
 * where React Loader's `useLiveMode` drives updates instead (see
 * `useLiveQuery.web.ts`).
 *
 * Note: published content only. To also stream drafts, create the client with a
 * viewer token + `useCdn: false` and pass `{ includeDrafts: true }` to
 * `client.live.events()` — never ship a token in a client bundle.
 */
export function useLcapiLiveQuery<T>(
  query: string,
  params: QueryParams = {},
): LiveQueryResult<T> {
  const [data, setData] = useState<T | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | undefined>(undefined);

  const syncTags = useRef<SyncTag[]>([]);
  // Stable dependency for the effect: params are recreated every render, but
  // their serialized value only changes when the actual query inputs change.
  const paramsKey = JSON.stringify(params);

  useEffect(() => {
    let cancelled = false;
    const queryParams = JSON.parse(paramsKey) as QueryParams;

    const load = async (lastLiveEventId?: string) => {
      try {
        const response = await client.fetch<T>(query, queryParams, {
          // Required to receive `syncTags` alongside the result.
          filterResponse: false,
          lastLiveEventId,
        });
        if (cancelled) return;
        syncTags.current = response.syncTags ?? [];
        setData(response.result);
        setError(undefined);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err : new Error(String(err)));
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();

    const subscription = client.live.events().subscribe({
      next: (event) => {
        if (event.type === 'message') {
          const isRelevant = event.tags.some((tag) =>
            syncTags.current.includes(tag),
          );
          if (isRelevant) load(event.id);
        } else if (event.type === 'restart' || event.type === 'reconnect') {
          // Stream reset or reconnected after a drop: refetch so we don't miss
          // changes that happened while we weren't listening.
          load();
        }
      },
      error: (err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err : new Error(String(err)));
        }
      },
    });

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, [query, paramsKey]);

  return { data, loading, error };
}

export default useLcapiLiveQuery;
