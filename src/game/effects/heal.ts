import type { Actor } from 'remiz';
import type { EffectScript } from 'remiz-game-systems';

import { Health } from '../components';

interface HealOptions {
  value: number
}

export class Heal implements EffectScript {
  private actor: Actor;
  private value: number;

  constructor(actor: Actor, options: HealOptions) {
    this.actor = actor;
    this.value = options.value;
  }

  apply(): void {
    const health = this.actor.getComponent(Health);

    if (!health) {
      return;
    }

    health.points += this.value;

    if (health.points > health.maxPoints) {
      health.points = health.maxPoints;
    }
  }

  onCancel(): void {}
}
