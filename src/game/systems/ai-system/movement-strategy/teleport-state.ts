import type { Actor } from 'remiz';
import { Transform } from 'remiz';

import * as EventType from '../../../events';

import type { MovementState } from './movement-state';
import { IdleState } from './idle-state';

export class TeleportState implements MovementState {
  private actor: Actor;
  target?: Actor;

  constructor(actor: Actor, target?: Actor) {
    this.actor = actor;
    this.target = target;
  }

  update(): MovementState {
    const targetTransform = this.target?.getComponent(Transform);

    if (targetTransform) {
      this.actor.dispatchEvent(EventType.Teleport, {
        x: targetTransform.offsetX,
        y: targetTransform.offsetY,
      });
    }

    return new IdleState(this.actor, this.target);
  }
}
