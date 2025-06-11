# visual-editing-react-native

The project is a starting point for creating React Native apps (using Expo) which correctly load and are editable within Sanity's Visual Editor (via the Presentation plugin in Sanity studio).

For more information on the implementation in this rep, visit the [Sanity docs on "Visual Editing with React Native and Expo"](https://sanity.io/docs/visual-editing/visual-editing-with-react-native-and-expo).

## Dependencies/PreWork

#### IMPORTANT: For the easiest starting point, this repo assumes that you have set up a Sanity project/studio and used the "Movies" starter template using the bootstrapping steps below.

#### Without the Sanity studio set up, the runtime of the React Native app itself shouldn't crash, but you won't see anything load on the test "movie" and "people" screens (feel free to remove them and update the nav if they are not needed, and in that case, you can set up a Sanity project/studio however you prefer and set the env file accordingly to point to that project -- see below).

**BOOTSTRAP STEPS FOR YOUR SANITY STUDIO**

**Note that the following steps are intended to be run in whatever repo you use for your Sanity Studio project -- they are NOT bootstrap steps for this `visual-editor-react-native` repo. For development in this repo, see "Development" below.**
1. Run `sanity init` in some repo (preferably a separate repo for simplicity and organization, since Sanity Studio is built on regular React, not React Native).
2. When that `sanity init` script asks you to choose a project template, choose `Movie project (schema + sample data)`.
3. When the init script asks `Add a sampling of sci-fi movies to your dataset on the hosted backend?`, you choose yes. 
4. Make sure that in that project's "API" tab on https://manage.sanity.io, you've added the following hosts to the allowed CORS origins (WITH credentials allowed if your front end queries will pass a Sanity token, see Token Management below):  
- `http://localhost:8081` (or whatever host/port you run the React Native app on) 
- `http://localhost:3333` (or whatever host/port you run your Sanity Studio on)
5. Added the `sanity/presentation` npm library to that Sanity Studio repo and in that repo add the following config to the "plugins" section of your sanity.config.ts/js: 
```
 presentationTool({
      resolve: locationResolver,
      previewUrl: {
        origin: 'http://localhost:8081',
        previewMode: {
          enable: '/preview-mode/enable',
          disable: '/preview-mode/disable',
        },
      },
    })
```
where the locationResolver is defined as: 
```
const locationResolver = {locations: {
  // Resolve locations using values from the matched document
  movie: defineLocations({
    select: {
      title: 'title',
      slug: 'slug.current',
    },
    resolve: (doc) => ({
      locations: [
        {
          title: 'Movies Directory',
          href: '/movies',
        },
        {
          title: `Movie Page: ${doc?.title}`,
          href: `/movie/${doc?.slug}`,
        },
      ],
    }),
  }),
  person: defineLocations({
    select: {
      name: 'name',
      slug: 'slug.current',
    },
    resolve: (doc) => ({
      locations: [
        {
          title: 'People Directory',
          href: '/people',
        },
        {
          title: `Person Page: ${doc?.name}`,
          href: `/person/${doc?.slug}`,
        },
      ],
    }),
  }),
}}
```

## Development

#### NOTE: pnpm is recommended, development using other package managers has not been rigorously tested.

#### Steps:
1. Create a Vercel project for your Expo web app (or a project on a similar hosting service -- MAKE SURE to choose one where you can set custom Content Security Policy headers, see vercel.json in this repo for a valid example header).

2. Create an Expo project for the Expo web builds and add its project ID to `app.json` (replace the existing project ID, not shown for cleanliness): 

```
"eas": {
   "projectId": "" <--- put your Expo project ID here!
}
```

3. If using Vercel, link the repo to your project via `npx vercel link`.

4. In the Vercel project's Environment Variables UI (or wherever you manage your env vars), add the following vars for each env you want to support (add at least Development and Production): 
    ```
    EXPO_PUBLIC_SANITY_PROJECT_ID=YOUR PROJECT ID
    EXPO_PUBLIC_SANITY_DATASET=THE DATASET FOR THE ENV
    EXPO_PUBLIC_SANITY_STUDIO_URL=THE URL OF YOUR SANITY STUDIO FOR THE ENV
    ```
    Only for Vercel: add `ENABLE_EXPERIMENTAL_COREPACK=1`, since corepack is enabled in the `vercel.json` build step.

    **When using Vercel:**


    For local development or local native builds, run "npx vercel env pull" to generate a .env.local file that Expo can use.
    For the deployed Expo web app build, Vercel should pick up the Production env you set up in the Vercel API.

4. Add the same enviroment variables in your Expo project's Environment Variables UI

5. Install dependencies
 
   ```
   pnpm install
   ```

6. Run the expo project (clears the metro cache)
    ```
    pnpm start
    ```

    Note: If you see an error warning in Cursor/VSCode in tsconfig.json about `expo/tsconfig.base` not existing, and you have already run the start command for the repo, sometimes you need to restart Cursor/VSCode (the IDE seems to have issues picking up the fact that expo starting up for the first time creates a .expo folder and clears that type error).
    
You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

**The main goal of this repo is to be able to open the Expo app INSIDE of Sanity Studio** 

So once you have started up the expo app:
1. Start the Sanity Studio steps above (start it up from its repo/directory -- the Studio code is not present in this codebase). 
2. Once that studio is running locally, visit `http://localhost:3333` (or whatever port you've configured for your studio, 3333 is the default)
3. Click the "Presentation" tab.



## Public vs Private Datasets 
NOTE the `useQuery` hook from `@sanity/react-loader` does not currently support a "token" parameter, so it does not currently support querying private data when you are NOT in Presentation mode in the Sanity Studio.
When you ARE in Presentation mode in the Sanity Studio, the `useLiveMode` hook takes over from `useQuery` for data fetching. 
That useLiveMode hook fetches data using a session cookie (set by the Presentation Plugin) to make queries that can include private data and draft content (for live editing updates).
The useLiveMode hook respects the user's role when determining which data/content types that user can access in Presentation mode (including Custom Roles).

TO QUERY PRIVATE DATA OUTSIDE PRESENTATION MODE --- create a private querying hook (call it `usePrivateQuery` or `useSanityQuery` or whatever you prefer) that allows you to perform token-authorized queries. Howeveer, NEVER EVER add that token to the client side bundle/environment, **IT IS AN API KEY**. Some example approaches for how to perform such queries:
1. Build an API that has custom auth (for however you authenticate your users) and returns a token for the Sanity client to use in calls to client.fetch (this is the simplest approach but has the negative side effect that it exposes the token to the client side, so any logged in user can take that token and take ANY action for which the token is authorized -- usually at a minimum this means making ANY query to your data, but can also even include writing data, updating settings, etc depending on the token).
2. Have a proxy API that has custom auth and can make queries on your behalf FROM the server, which never exposes the token to client side users. (this allows you to either allow arbitrary queries if all authorized users should be able to make any query OR even allows you to lock down which queries can be made by exposing API routes for individual queries).

Once you have that private querying hook in place, decide at runtime whether to use the Sanity react-loader's useQuery from this file or your own usePrivateQuery depending on whether you are in presentation mode. 
Determining whether you are in presentation mode can be done with a helper from @sanity/presentation-comlink. Import it with: `import {isMaybePresentation} from '@sanity/presentation-comlink`.

So an example usage might be like: 

```
    const usePrivateQuery = import "@/hooks/usePrivateQuery"
    
    <!-- In a real life example, put this "createQueryStore" call in its own module so that it is called ONLY once and imported into components where used -->

    const { useLiveMode, useQuery} = createQueryStore({ client, ssr:false })

    function SomeComponent {
        const { data } = isMaybePresentation() ? useQuery(query) : usePrivateQuery()

        return <div>...contents</div>
    }

```

## Live Mode (Inside Presentation vs Outside)

When you ARE in Presentation mode, `useLiveMode` as implemented in this repo will use the Live Content API to show you the latest content for whatever "perspective" mode you set in the Presentation UI itself (defaults to "Drafts", but can be changed to other perspectives in that UI, e.g. "Published").

OUTSIDE of presentation mode, to use the Live Content API, you must implement a connection mechanism for it in your project. A package is WIP for an out-of-the-box Live Content API connector for pure React/React Native and will be added to this repo when available, but currently the only out-of-the-box solution is for NextJS.

To see example/starting poing implementations, visit the [`lcapi-examples` Github Repo](https://github.com/sanity-io/lcapi-examples/tree/main).


## GOTCHAS (for this repo)
#### #1 -- PNPM Install + Expo
I've noticed that very occasionally on a clean install, `pnpm install` does not seem to install all of expo's dependencies (sometimes the error is shown at install and sometimes at runtime) -- when I run into this, I generally just remove node_modules and pnpm-lock.yaml, clear the pnpm cache (`pnpm cache delete`), and re-run `pnpm install`. NOTE that by removing the lockfile you may advance your dependency versions, so be prepared for those changes (or roll back to a previous version of the lockfile and remove/reinstall the node_modules).



## Deployment
#### DON'T DEPLOY THE EXPO WEB APP ON EXPO HOSTING -- Expo hosting adds a Content Security Policy header by default that prevents the Sanity Studio from loading the Expo web app in an iframe. Deploy instead to Vercel, Netlify, or another service that allows you to customize that header. You can/should still build your actual native device/simulator builds using the Expo build servers. 

### Shared Setup for Native and Web App builds (app.json)
Make sure to change the projectId in app.json to your own project's ID.

### Native/Simulator Builds
Make sure you have an Expo project in the Expo dashboard with your environment variables defined (see above)

Follow Expo's guides building for iOS simulator, iOS, Android, etc and chosen environment (development, preview, production, etc), depending on your use case.  (This project was built successfully as a preview build for iOS simulator, so it should work for at least that use case). 

### Web Deployments
In this codebase, I've set the projet up to deploy the web build of the Expo app to Vercel hosting with:
```
pnpm deploy:web
```

**I've configured the web app's vercel.json to add a correct CSP header that allows my own sanity studio URL to load this web app in an iframe (see vercel.json). Update the CSP header rewrite in vercel.json to use your own studio URL or refactor the codebase to use a different hosting service (see warning above about Expo Hosting and Presentation mode; the two are incompatible at this time due to configuration constraints in Expo).**

Update any URLs in the Studio's project CORS origins accordingly. Any host that wants to query your project has to be allowed in those project CORS settings (set Allow Credentials to true).

## Other Notes
Several standard modules from Node that are part of the @sanity library but are not in the React Native runtime are shimmed using metro.config.js. Run the expo start command above with the `--clear` flag to clear the metro cache if you make additions/modifications to those shims for your own use case.
