import { isMaybePresentation } from "@sanity/presentation-comlink";
import { createDataAttribute, CreateDataAttributeProps } from '@sanity/visual-editing';
import { Platform } from "react-native";

export const isWeb = Platform.OS === 'web'

export const createDataAttributeWebOnly = (attr: CreateDataAttributeProps) => {
  if (isWeb && isMaybePresentation()) {
    return createDataAttribute(attr)
  }
}