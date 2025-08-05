import { SANITY_DATASET, SANITY_PROJECT_ID, SANITY_STUDIO_URL } from '@/constants';
import { createDataAttribute, CreateDataAttributeProps } from '@sanity/visual-editing';
import { Platform } from "react-native";

export const isWeb = Platform.OS === 'web'


// Your Sanity configuration
const config = {
  projectId: SANITY_PROJECT_ID,
  dataset: SANITY_DATASET,
  baseUrl: SANITY_STUDIO_URL,
}

export const createDataAttributeProp = (attr: CreateDataAttributeProps) => {
  if (isWeb) {
    console.log('creating data attribute', {attr})
    const attribute = createDataAttribute({...config, ...attr})?.toString()
    if (attribute) {
      return {dataSet: {sanity: attribute}}
    }
  }
  return undefined
}