import type {
  ScriptOptions,
} from 'remiz';
import {
  Actor,
  Script,
  Transform,
} from 'remiz';

import { Teleport } from '../../events';
import type { TeleportEvent } from '../../events';

export class GhostScript extends Script {
  private actor: Actor;

  constructor(options: ScriptOptions) {
    super();

    this.actor = options.actor;

    this.actor.addEventListener(Teleport, this.handleTeleport);
  }

  destroy(): void {
    this.actor.removeEventListener(Teleport, this.handleTeleport);
  }

  private handleTeleport = (event: TeleportEvent): void => {
    const transform = this.actor.getComponent(Transform);

    transform.offsetX = event.x;
    transform.offsetY = event.y;
  };
}

GhostScript.scriptName = 'GhostScript';
