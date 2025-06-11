// client.ts
import { SANITY_DATASET, SANITY_PROJECT_ID, SANITY_STUDIO_URL } from "@/constants";
import { isWeb } from "@/utils/preview";
import { createClient } from "@sanity/client";

export const client = createClient({
    projectId: SANITY_PROJECT_ID,
    dataset: SANITY_DATASET,
    useCdn: true,
    apiVersion: '2025-05-30',
    stega: {
      enabled: !!isWeb,
      studioUrl: SANITY_STUDIO_URL
    }
  })