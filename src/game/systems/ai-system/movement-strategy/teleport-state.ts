import type { Actor } from 'remiz';
import { Transform, ColliderContainer } from 'remiz';

import * as EventType from '../../../events';
import { GroundDetector } from '../../../components';

import type { MovementState } from './movement-state';
import { IdleState } from './idle-state';

const CAST_TIME = 200;

interface BoxCollider {
  sizeX: number
  sizeY: number
  centerX: number;
  centerY: number;
}

export class TeleportState implements MovementState {
  private actor: Actor;
  target?: Actor;

  private castTime: number;

  constructor(actor: Actor, target?: Actor) {
    this.actor = actor;
    this.target = target;

    this.castTime = CAST_TIME;
  }

  update(deltaTime: number): MovementState {
    this.castTime -= deltaTime;
    if (this.castTime > 0) {
      return this;
    }

    if (!this.target) {
      return new IdleState(this.actor, this.target);
    }

    const rightSide = this.target.children.find((child) => {
      const groundDetector = child.getComponent(GroundDetector);
      return groundDetector?.isGround && groundDetector?.direction > 0;
    });
    const leftSide = this.target.children.find((child) => {
      const groundDetector = child.getComponent(GroundDetector);
      return groundDetector?.isGround && groundDetector?.direction < 0;
    });
    const teleportTarget = rightSide || leftSide || this.target;
    const transform = teleportTarget.getComponent(Transform);

    const targetCollider = this.target.getComponent(ColliderContainer).collider as BoxCollider;
    const collider = this.actor.getComponent(ColliderContainer).collider as BoxCollider;

    const x = transform.offsetX;
    const y = transform.offsetY
      + targetCollider.sizeY / 2 + targetCollider.centerY
      - collider.sizeY / 2 - collider.centerY;

    this.actor.dispatchEvent(EventType.Teleport, { x, y });

    return new IdleState(this.actor, this.target);
  }
}
