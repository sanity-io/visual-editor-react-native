import { SANITY_DATASET, SANITY_PROJECT_ID, SANITY_STUDIO_URL } from '@/constants';
import { isMaybePresentation } from "@sanity/presentation-comlink";
import { createDataAttribute, CreateDataAttributeProps } from '@sanity/visual-editing';
import { Platform } from "react-native";

export const isWeb = Platform.OS === 'web'


// Your Sanity configuration
const config = {
  projectId: SANITY_PROJECT_ID,
  dataset: SANITY_DATASET,
  baseUrl: SANITY_STUDIO_URL,
}

export const createDataAttributeWebOnly = (attr: CreateDataAttributeProps) => {
  if (isWeb && isMaybePresentation()) {
    return createDataAttribute({...config, ...attr})
  }
}