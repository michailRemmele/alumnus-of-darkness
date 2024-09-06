import {
  ParallaxSystem,
  Parallax,
  EffectsSystem,
  Effect,
} from 'remiz-game-systems';
import {
  parallaxSystem,
  parallax,
  effectsSystem,
  effect,
  locales as gameSystemsLocales,
} from 'remiz-game-systems/schema';

import {
  componentsSchema as gameComponentsSchema,
  systemsSchema as gameSystemsSchema,
  resourcesSchema,
} from './schema';
import { globalReferences } from './references';

import en from './locales/en.json';

const locales = {
  en: {
    ...en,
    ...gameSystemsLocales.en,
  },
};

export const componentsSchema = {
  ...gameComponentsSchema,
  [Parallax.componentName]: parallax,
  [Effect.componentName]: effect,
};

export const systemsSchema = {
  ...gameSystemsSchema,
  [ParallaxSystem.systemName]: parallaxSystem,
  [EffectsSystem.systemName]: effectsSystem,
};

export {
  resourcesSchema,
  globalReferences,
  locales,
};
