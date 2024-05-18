import type { Actor } from 'remiz';

import type { MovementState } from './movement-state';
import { idleTransitions } from './transitions';

export class IdleState implements MovementState {
  private actor: Actor;
  target?: Actor;

  constructor(actor: Actor, target?: Actor) {
    this.actor = actor;
    this.target = target;
  }

  update(): MovementState {
    let nextState: MovementState | undefined;
    for (const transition of idleTransitions) {
      nextState = transition(this.actor, this.target);
      if (nextState) {
        return nextState;
      }
    }

    return this;
  }
}
