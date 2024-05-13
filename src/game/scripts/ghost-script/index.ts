import type {
  ScriptOptions,
  ActorSpawner,
  Scene,
} from 'remiz';
import {
  Actor,
  Script,
  Transform,
} from 'remiz';

import * as EventType from '../../events';
import type { TeleportEvent } from '../../events';
import { TELEPORT_FROM_ID, TELEPORT_TO_ID } from '../../../consts/templates';

export class GhostScript extends Script {
  private actor: Actor;
  private actorSpawner: ActorSpawner;
  private scene: Scene;

  constructor(options: ScriptOptions) {
    super();

    this.actor = options.actor;
    this.actorSpawner = options.actorSpawner;
    this.scene = options.scene;

    this.actor.addEventListener(EventType.Teleport, this.handleTeleport);
  }

  destroy(): void {
    this.actor.removeEventListener(EventType.Teleport, this.handleTeleport);
  }

  private spawnSmoke(templateId: string, x: number, y: number): void {
    const teleportFrom = this.actorSpawner.spawn(templateId);
    const teleportFromTransform = teleportFrom.getComponent(Transform);

    teleportFromTransform.offsetX = x;
    teleportFromTransform.offsetY = y;

    this.scene.appendChild(teleportFrom);
    teleportFrom.dispatchEvent(EventType.Kill);
  }

  private handleTeleport = (event: TeleportEvent): void => {
    const transform = this.actor.getComponent(Transform);

    this.spawnSmoke(TELEPORT_FROM_ID, transform.offsetX, transform.offsetY);
    this.spawnSmoke(TELEPORT_TO_ID, event.x, event.y);

    transform.offsetX = event.x;
    transform.offsetY = event.y;
  };
}

GhostScript.scriptName = 'GhostScript';
