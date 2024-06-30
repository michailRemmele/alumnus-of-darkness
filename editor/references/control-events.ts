import type { Reference } from 'remiz-editor';

import {
  Move,
  MoveJump,
  ResurrectInput,
  SummonInput,
  SelectMinion,
} from '../../src/game/events';

export const controlEventsReference: Reference = {
  items: [
    Move,
    MoveJump,
    ResurrectInput,
    SummonInput,
    SelectMinion,
  ].map((value) => ({ title: value, value })),
};
