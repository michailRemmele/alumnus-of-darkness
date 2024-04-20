import { ActorCollection, MathOps, System } from 'remiz';
import type { SystemOptions, Scene } from 'remiz';

import * as EventType from '../../events';
import type { ThumbStickInputEvent } from '../../events';
import { ThumbStickControl } from '../../components';

export class ThumbStickController extends System {
  private actorCollection: ActorCollection;
  private scene: Scene;

  private currentX: number;
  private currentY: number;
  private currentAngle: number | null;

  constructor(options: SystemOptions) {
    super();

    this.actorCollection = new ActorCollection(options.scene, {
      components: [ThumbStickControl],
    });
    this.scene = options.scene;
    this.currentX = 0;
    this.currentY = 0;
    this.currentAngle = null;
  }

  mount(): void {
    this.scene.addEventListener(EventType.ThumbStickInput, this.handleInput);
  }

  unmount(): void {
    this.scene.removeEventListener(EventType.ThumbStickInput, this.handleInput);
  }

  private handleInput = (event: ThumbStickInputEvent): void => {
    const { x, y } = event;

    this.currentX = x;
    this.currentY = y;

    this.currentAngle = (x || y)
      ? MathOps.radToDeg(MathOps.getAngleBetweenTwoPoints(x, 0, y, 0))
      : null;
  };

  update(): void {
    if (this.currentAngle === null) {
      return;
    }

    this.actorCollection.forEach((actor) => {
      const control = actor.getComponent(ThumbStickControl);
      const eventBinding = control.inputEventBindings[EventType.ThumbStickInput];

      if (eventBinding) {
        if (!eventBinding.eventType) {
          throw new Error(
            `The event type not specified for input event: ${EventType.ThumbStickInput}`,
          );
        }

        actor.dispatchEvent(eventBinding.eventType, {
          ...eventBinding.attrs,
          x: this.currentX,
          y: this.currentY,
          angle: this.currentAngle,
        });
      }
    });
  }
}

ThumbStickController.systemName = 'ThumbStickController';
