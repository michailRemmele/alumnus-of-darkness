import type {
  ScriptOptions,
} from 'remiz';
import {
  Actor,
  Script,
  Transform,
  ColliderContainer,
  RigidBody,
} from 'remiz';
import { CollisionEnter, CollisionLeave } from 'remiz/events';
import type { CollisionEnterEvent, CollisionLeaveEvent } from 'remiz/events';

import { GroundDetector } from '../../components';

const DETECTOR_SIZE_X = 6;
const DETECTOR_SIZE_Y = 6;

const OFFSET_X_FACTOR = 1.5;

interface BoxCollider {
  sizeX: number
  sizeY: number
  centerX: number;
  centerY: number;
}

export class GroundDetectorScript extends Script {
  private actor: Actor;
  private groundCounter: number;

  constructor(options: ScriptOptions) {
    super();

    this.actor = options.actor;
    this.groundCounter = 0;

    const transform = this.actor.getComponent(Transform);
    const groundDetector = this.actor.getComponent(GroundDetector);
    const collider = this.actor.getComponent(ColliderContainer).collider as BoxCollider;

    const parent = this.actor.parent as Actor;
    const parentCollider = parent.getComponent(ColliderContainer).collider as BoxCollider;

    collider.sizeX = DETECTOR_SIZE_X;
    collider.sizeY = DETECTOR_SIZE_Y;

    transform.relativeOffsetX = groundDetector.direction > 0
      ? parentCollider.sizeX * OFFSET_X_FACTOR + parentCollider.centerX
      : -parentCollider.sizeX * OFFSET_X_FACTOR + parentCollider.centerX;

    collider.centerY = parentCollider.sizeY / 2 + parentCollider.centerY + DETECTOR_SIZE_Y / 2;

    this.actor.addEventListener(CollisionEnter, this.handleCollisionEnter);
    this.actor.addEventListener(CollisionLeave, this.handleCollisionLeave);
  }

  destroy(): void {
    this.actor.removeEventListener(CollisionEnter, this.handleCollisionEnter);
    this.actor.removeEventListener(CollisionLeave, this.handleCollisionLeave);
  }

  private handleCollisionEnter = (event: CollisionEnterEvent): void => {
    const rigidBody = event.actor.getComponent(RigidBody) as RigidBody | undefined;
    if (rigidBody && rigidBody.type === 'static' && !rigidBody.isPermeable) {
      this.groundCounter += 1;

      const groundDetector = this.actor.getComponent(GroundDetector);
      groundDetector.isGround = this.groundCounter > 0;
    }
  };

  private handleCollisionLeave = (event: CollisionLeaveEvent): void => {
    const rigidBody = event.actor.getComponent(RigidBody) as RigidBody | undefined;
    if (rigidBody && rigidBody.type === 'static' && !rigidBody.isPermeable) {
      this.groundCounter -= 1;

      const groundDetector = this.actor.getComponent(GroundDetector);
      groundDetector.isGround = this.groundCounter > 0;
    }
  };
}

GroundDetectorScript.scriptName = 'GroundDetectorScript';
