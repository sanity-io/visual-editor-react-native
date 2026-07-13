import { useLcapiLiveQuery, type LiveQueryResult } from './useLcapiLiveQuery';

/**
 * Native (iOS/Android) implementation of `useLiveQuery`.
 *
 * There is no Presentation mode on native, so we always connect to the Live
 * Content API directly. On web this file is shadowed by `useLiveQuery.web.ts`,
 * which additionally handles the in-Presentation case.
 */
export const useLiveQuery = useLcapiLiveQuery;
export type { LiveQueryResult };
export default useLiveQuery;
