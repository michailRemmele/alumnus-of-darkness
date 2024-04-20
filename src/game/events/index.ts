import type { ActorEvent } from 'remiz';

export const ThumbStickInput = 'ThumbStickInput';
export const Move = 'Move';
export const MoveJump = 'MoveJump';
export const ResurrectInput = 'ResurrectInput';
export const Resurrect = 'Resurrect';
export const SummonInput = 'SummonInput';
export const Summon = 'Summon';
export const Kill = 'Kill';
export const Attack = 'Attack';
export const Damage = 'Damage';

export type ThumbStickInputEvent = ActorEvent<{
  x: number
  y: number
}>;

export type MoveEvent = ActorEvent<{
  direction: number
  angle?: number
  x?: number
  y?: number
}>;

export type AttackEvent = ActorEvent<{
  x: number
  y: number
}>;

export type DamageEvent = ActorEvent<{
  value: number
}>;

declare module 'remiz' {
  export interface ActorEventMap {
    [ThumbStickInput]: ThumbStickInputEvent
    [Move]: MoveEvent
    [MoveJump]: ActorEvent
    [ResurrectInput]: ActorEvent
    [SummonInput]: ActorEvent
    [Resurrect]: ActorEvent
    [Summon]: ActorEvent
    [Kill]: ActorEvent
    [Attack]: AttackEvent
    [Damage]: DamageEvent
  }
}
