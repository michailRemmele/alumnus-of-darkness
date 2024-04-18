import {
  System,
} from 'remiz';
import type {
  Scene,
  SystemOptions,
} from 'remiz';

import * as EventType from '../../events';
import type { DamageEvent } from '../../events';
import { Health } from '../../components';

export class DamageSystem extends System {
  private scene: Scene;

  constructor(options: SystemOptions) {
    super();

    this.scene = options.scene;
  }

  mount(): void {
    this.scene.addEventListener(EventType.Damage, this.handleDamage);
  }

  unmount(): void {
    this.scene.removeEventListener(EventType.Damage, this.handleDamage);
  }

  handleDamage = (event: DamageEvent): void => {
    const { target, value } = event;

    const health = target.getComponent(Health);

    if (!health) {
      return;
    }

    health.points -= Math.round(value);
  };
}

DamageSystem.systemName = 'DamageSystem';
