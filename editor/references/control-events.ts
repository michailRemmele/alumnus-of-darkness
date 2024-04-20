import type { Reference } from 'remiz-editor';

import {
  Move,
  MoveJump,
  ResurrectInput,
  SummonInput,
} from '../../src/game/events';

export const controlEventsReference: Reference = {
  items: [
    Move,
    MoveJump,
    ResurrectInput,
    SummonInput,
  ].map((value) => ({ title: value, value })),
};
