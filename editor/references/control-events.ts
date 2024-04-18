import type { Reference } from 'remiz-editor';

import {
  MoveLeft,
  MoveRight,
  MoveJump,
  ResurrectInput,
  SummonInput,
} from '../../src/game/events';

export const controlEventsReference: Reference = {
  items: [
    MoveLeft,
    MoveRight,
    MoveJump,
    ResurrectInput,
    SummonInput,
  ].map((value) => ({ title: value, value })),
};
