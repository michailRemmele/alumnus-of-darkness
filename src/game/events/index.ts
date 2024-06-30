import type { ActorEvent, SceneEvent } from 'remiz';

export const ThumbStickInput = 'ThumbStickInput';
export const Move = 'Move';
export const MoveJump = 'MoveJump';
export const Teleport = 'Teleport';
export const ResurrectInput = 'ResurrectInput';
export const Resurrect = 'Resurrect';
export const SummonInput = 'SummonInput';
export const Summon = 'Summon';
export const Kill = 'Kill';
export const Attack = 'Attack';
export const Damage = 'Damage';
export const SelectMinion = 'SelectMinion';

export type MoveEvent = ActorEvent<{
  direction: number
  angle?: number
  x?: number
  y?: number
}>;

export type ThumbStickInputEvent = ActorEvent<{ x: number; y: number }>;
export type TeleportEvent = ActorEvent<{ x: number; y: number }>;
export type AttackEvent = ActorEvent<{ x: number; y: number }>;
export type DamageEvent = ActorEvent<{ value: number }>;

export type SelectMinionEvent = SceneEvent<{ index: number }>;

declare module 'remiz' {
  export interface ActorEventMap {
    [ThumbStickInput]: ThumbStickInputEvent
    [Move]: MoveEvent
    [MoveJump]: ActorEvent
    [Teleport]: TeleportEvent
    [ResurrectInput]: ActorEvent
    [SummonInput]: ActorEvent
    [Resurrect]: ActorEvent
    [Summon]: ActorEvent
    [Kill]: ActorEvent
    [Attack]: AttackEvent
    [Damage]: DamageEvent
  }

  export interface SceneEventMap {
    [SelectMinion]: SelectMinionEvent
  }
}
