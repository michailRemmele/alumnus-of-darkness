import {
  ActorCollection,
  System,
  ColliderContainer,
} from 'remiz';
import type {
  SystemOptions,
} from 'remiz';

import {
  Health,
  Movement,
  AI,
  Weapon,
  Ghost,
  HitBox,
  Resurrectable,
} from '../../components';
import * as EventType from '../../events';

const COMPONENTS_TO_DELETE = [Health, Movement, AI, Weapon];
const RESURRECTION_RADIUS = 24;

export class HealthSystem extends System {
  private actorCollection: ActorCollection;

  constructor(options: SystemOptions) {
    super();

    this.actorCollection = new ActorCollection(options.scene, {
      components: [Health],
    });
  }

  update(): void {
    this.actorCollection.forEach((actor) => {
      const { points } = actor.getComponent(Health);

      if (points <= 0) {
        if (!actor.getComponent(Ghost) && actor.getComponent(AI)) {
          const colliderContainer = new ColliderContainer({
            type: 'circleCollider',
            collider: {
              radius: RESURRECTION_RADIUS,
              centerX: 0,
              centerY: 0,
            },
          });
          const resurrectionArea = actor.children.find(
            (child) => child.getComponent(Resurrectable),
          );
          resurrectionArea?.setComponent(colliderContainer);
        }

        COMPONENTS_TO_DELETE.forEach((Component) => actor.removeComponent(Component));

        const hitBox = actor.children.find((child) => child.getComponent(HitBox));
        hitBox?.remove();

        actor.dispatchEvent(EventType.Kill);
      }
    });
  }
}

HealthSystem.systemName = 'HealthSystem';
