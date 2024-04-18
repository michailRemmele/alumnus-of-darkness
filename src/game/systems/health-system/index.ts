import {
  ActorCollection,
  System,
} from 'remiz';
import type {
  SystemOptions,
  ActorSpawner,
} from 'remiz';

import {
  Health,
  Movement,
  AI,
  Weapon,
  Ghost,
  HitBox,
} from '../../components';
import * as EventType from '../../events';
import { RESURRECTION_AREA_ID } from '../../../consts/templates';

const COMPONENTS_TO_DELETE = [Health, Movement, AI, Weapon];

export class HealthSystem extends System {
  private actorCollection: ActorCollection;
  private actorSpawner: ActorSpawner;

  constructor(options: SystemOptions) {
    super();

    this.actorCollection = new ActorCollection(options.scene, {
      components: [Health],
    });
    this.actorSpawner = options.actorSpawner;
  }

  update(): void {
    this.actorCollection.forEach((actor) => {
      const { points } = actor.getComponent(Health);

      if (points <= 0) {
        if (!actor.getComponent(Ghost) && actor.getComponent(AI)) {
          const resurrectionArea = this.actorSpawner.spawn(RESURRECTION_AREA_ID);
          actor.appendChild(resurrectionArea);
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
