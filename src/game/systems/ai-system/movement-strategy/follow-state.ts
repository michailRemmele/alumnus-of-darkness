import type { Actor } from 'remiz';
import { Transform } from 'remiz';

import * as EventType from '../../../events';

import type { MovementState } from './movement-state';
import { followTransitions } from './transitions';

export class FollowState implements MovementState {
  private actor: Actor;
  target?: Actor;

  constructor(actor: Actor, target?: Actor) {
    this.actor = actor;
    this.target = target;
  }

  update(): MovementState {
    const transform = this.actor.getComponent(Transform);
    const targetTransform = this.target?.getComponent(Transform);

    if (targetTransform) {
      this.actor.dispatchEvent(
        EventType.Move,
        { direction: transform.offsetX > targetTransform.offsetX ? -1 : 1 },
      );
    }

    let nextState: MovementState | undefined;
    for (const transition of followTransitions) {
      nextState = transition(this.actor, this.target);
      if (nextState) {
        return nextState;
      }
    }

    return this;
  }
}
