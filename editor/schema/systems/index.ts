import type { WidgetSchema } from 'remiz-editor';

import {
  HealthSystem,
  MovementSystem,
  AISystem,
  FightSystem,
  DamageSystem,
  Reaper,
} from '../../../src/game/systems';

import { healthSystem } from './health-system';
import { movementSystem } from './movement-system';
import { aiSystem } from './ai-system';
import { fightSystem } from './fight-system';
import { damageSystem } from './damage-system';
import { reaper } from './reaper';

export const systemsSchema: Record<string, WidgetSchema> = {
  [HealthSystem.systemName]: healthSystem,
  [MovementSystem.systemName]: movementSystem,
  [AISystem.systemName]: aiSystem,
  [FightSystem.systemName]: fightSystem,
  [DamageSystem.systemName]: damageSystem,
  [Reaper.systemName]: reaper,
};
