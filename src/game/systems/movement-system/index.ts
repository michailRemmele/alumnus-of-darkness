import {
  Scene,
  ActorCollection,
  Vector2,
  Transform,
  RigidBody,
  System,
  MathOps,
  VectorOps,
} from 'remiz';
import type {
  SystemOptions,
  UpdateOptions,
  ActorEvent,
} from 'remiz';
import { CollisionEnter, AddImpulse } from 'remiz/events';
import type { CollisionEnterEvent } from 'remiz/events';

import {
  Movement,
} from '../../components';
import * as EventType from '../../events';
import type { MoveEvent } from '../../events';

const JUMP_IMPULSE = -230;
const SPEED_DIVIDER = 0.4;
const MIN_SPEED = 0.5;
const MAX_SPEED = 1;

export class MovementSystem extends System {
  private scene: Scene;
  private actorCollection: ActorCollection;

  constructor(options: SystemOptions) {
    super();

    this.scene = options.scene;
    this.actorCollection = new ActorCollection(options.scene, {
      components: [
        Transform,
        Movement,
      ],
    });
  }

  mount(): void {
    this.scene.addEventListener(CollisionEnter, this.handleCollisionEnter);
    this.scene.addEventListener(EventType.Move, this.handleMove);
    this.scene.addEventListener(EventType.MoveJump, this.handleJump);
  }

  unmount(): void {
    this.scene.removeEventListener(CollisionEnter, this.handleCollisionEnter);
    this.scene.removeEventListener(EventType.Move, this.handleMove);
    this.scene.removeEventListener(EventType.MoveJump, this.handleJump);
  }

  private handleMove = (event: MoveEvent): void => {
    const movement = event.target.getComponent(Movement);
    if (!movement) {
      return;
    }

    const direction = event.angle !== undefined
      ? VectorOps.getVectorByAngle(MathOps.degToRad(event.angle)).x
      : event.direction;

    let intension = 1;
    if (event.x && event.y) {
      const controlIntension = MathOps.getDistanceBetweenTwoPoints(0, event.x, 0, event.y);
      intension = controlIntension < SPEED_DIVIDER ? MIN_SPEED : MAX_SPEED;
    }

    movement.direction = direction * intension;
    movement.isMoving = true;
  };

  private handleJump = (event: ActorEvent): void => {
    const movement = event.target.getComponent(Movement);
    if (!movement || movement.isJumping) {
      return;
    }

    event.target.dispatchEvent(AddImpulse, {
      value: new Vector2(0, JUMP_IMPULSE),
    });
    movement.isJumping = true;
  };

  private handleCollisionEnter = (event: CollisionEnterEvent): void => {
    const { mtv, actor, target } = event;

    const movement = target.getComponent(Movement);
    if (movement === undefined) {
      return;
    }

    if (mtv.x === 0 && mtv.y < 0 && !!actor.getComponent(RigidBody)) {
      movement.isJumping = false;
    }
  };

  update(options: UpdateOptions): void {
    const deltaTimeInSeconds = options.deltaTime / 1000;

    this.actorCollection.forEach((actor) => {
      const movement = actor.getComponent(Movement);

      if (!movement.isMoving) {
        movement.direction = 0;
        return;
      }

      const movementDelta = movement.direction * movement.speed * deltaTimeInSeconds;

      const transform = actor.getComponent(Transform);
      transform.offsetX += movementDelta;

      movement.viewDirection = movement.direction;
      movement.isMoving = false;
    });
  }
}

MovementSystem.systemName = 'MovementSystem';
