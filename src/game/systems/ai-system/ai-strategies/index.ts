import type { Constructor } from '../../../../types/utils';

import { LightFighterStrategy } from './light-fighter-strategy';
import { ArcherStrategy } from './archer-strategy';
import type { AIStrategy } from './ai-strategy';

export const strategies: Record<string, Constructor<AIStrategy>> = {
  lightFighter: LightFighterStrategy,
  archer: ArcherStrategy,
};
