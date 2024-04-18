import {
  System,
  ColliderContainer,
  ActorCollection,
} from 'remiz';
import type {
  Scene,
  SystemOptions,
  UpdateOptions,
} from 'remiz';
import { RemoveActor } from 'remiz/events';
import type { RemoveActorEvent } from 'remiz/events';

import { AI } from '../../components';

import { strategies } from './ai-strategies';
import type { AIStrategy } from './ai-strategies/ai-strategy';

export class AISystem extends System {
  private scene: Scene;
  private aiCollection: ActorCollection;
  private unitStrategies: Record<string, AIStrategy>;

  constructor(options: SystemOptions) {
    super();

    this.scene = options.scene;
    this.aiCollection = new ActorCollection(options.scene, {
      components: [
        AI,
        ColliderContainer,
      ],
    });

    this.unitStrategies = {};
  }

  mount(): void {
    this.aiCollection.addEventListener(RemoveActor, this.handleRemoveActor);
  }

  unmount(): void {
    this.aiCollection.removeEventListener(RemoveActor, this.handleRemoveActor);
  }

  private handleRemoveActor = (event: RemoveActorEvent): void => {
    this.unitStrategies[event.actor.id]?.destroy();
    delete this.unitStrategies[event.actor.id];
  };

  update(options: UpdateOptions): void {
    const { deltaTime } = options;

    this.aiCollection.forEach((actor) => {
      if (!this.unitStrategies[actor.id]) {
        const ai = actor.getComponent(AI);

        const Strategy = strategies[ai.strategy];

        this.unitStrategies[actor.id] = new Strategy(actor, this.scene, ai.isEnemy);
      }

      this.unitStrategies[actor.id].update(deltaTime);
    });
  }
}

AISystem.systemName = 'AISystem';
