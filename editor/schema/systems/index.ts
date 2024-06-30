import type { WidgetSchema } from 'remiz-editor';

import {
  MovementSystem,
  AISystem,
  FightSystem,
  Reaper,
  ThumbStickController,
} from '../../../src/game/systems';

import { movementSystem } from './movement-system';
import { aiSystem } from './ai-system';
import { fightSystem } from './fight-system';
import { reaper } from './reaper';
import { thumbStickController } from './thumb-stick-controller';

export const systemsSchema: Record<string, WidgetSchema> = {
  [MovementSystem.systemName]: movementSystem,
  [AISystem.systemName]: aiSystem,
  [FightSystem.systemName]: fightSystem,
  [Reaper.systemName]: reaper,
  [ThumbStickController.systemName]: thumbStickController,
};
