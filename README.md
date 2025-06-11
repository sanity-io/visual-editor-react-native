# visual-editing-react-native


## Public vs Private Data 
NOTE that useQuery does not have a "token" parameter, so it does not currently support querying private data OUTSIDE of presentation mode.
In Presentation/Visual Editing mode inside the Sanity Studio, the useLiveMode takes over from useQuery for data fetching. 
That useLiveMode hook fetches data using a session cookie (set by the Presentation Plugin) to make queries that can include private data and draft content (for live editing updates).
The useLiveMode hook respects the user's role when determining which data that user can access in Presentation mode (including Custom Roles)

TO QUERY PRIVATE DATA OUTSIDE PRESENTATION MODE --- create a private querying hook (call it `usePrivateQuery` or `useSanityQuery` or whatever you prefer) that allows you to query with a token WITHOUT adding that token to the client side bundle/environment. Some example approaches:
1. Have a proxy API that has custom auth and returns a token for the client (technically easiest but exposes the token to the client side so any logged in user can take that token and make any query)
2. Have a proxy API that has custom auth and can make queries on your behalf (allows you to lock down which queries can be made by never exposing the token to the client side)

Once you have that query, decide at runtime whether to use the Sanity react-loader's useQuery from this file or your own usePrivateQuery depending on whether you are in presentation mode. 
Determining whether you are in presentation mode can be done with a helper from @sanity/presentation-comlink. Import it with: `import {isMaybePresentation} from '@sanity/presentation-comlink`.
So an example usage might be like: 

```
TODO FILL THIS IN ONCE TESTED!!!

```

## Live Mode (Inside Presentation vs Outside)
TODO fill this in
