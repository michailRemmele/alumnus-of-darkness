import type { Actor } from 'remiz';

export interface MovementState {
  target?: Actor
  update(deltaTime: number): MovementState
}
