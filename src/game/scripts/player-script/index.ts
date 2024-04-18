import type {
  ActorSpawner,
  ScriptOptions,
  Scene,
  UpdateOptions,
  ActorEvent,
} from 'remiz';
import { Actor, Script, Transform } from 'remiz';
import { CollisionEnter, CollisionLeave } from 'remiz/events';
import type { CollisionEnterEvent, CollisionLeaveEvent } from 'remiz/events';

import * as EventType from '../../events';
import {
  ARCHER_ID,
  LIGHT_FIGHTER_ID,
  ARCHER_GHOST_ID,
  LIGHT_FIGHTER_GHOST_ID,
} from '../../../consts/templates';
import { Resurrectable, Spellbook } from '../../components';

const SUMMON_COOLDOWN = 2000;
const MAX_GHOSTS = 2;

const RESURRECT_MAP: Record<string, string> = {
  [LIGHT_FIGHTER_ID]: LIGHT_FIGHTER_GHOST_ID,
  [ARCHER_ID]: ARCHER_GHOST_ID,
};

export class PlayerScript extends Script {
  private scene: Scene;
  private actor: Actor;
  private actorSpawner: ActorSpawner;
  private canResurrect: Array<Actor>;
  private activeGhosts: Array<Actor>;
  private summonCooldown: number;
  private lastResurrectedId: string | undefined;

  constructor(options: ScriptOptions) {
    super();

    this.scene = options.scene;
    this.actor = options.actor;
    this.actorSpawner = options.actorSpawner;
    this.canResurrect = [];
    this.activeGhosts = [];
    this.summonCooldown = 0;

    this.actor.addEventListener(CollisionEnter, this.handleCanResurrect);
    this.actor.addEventListener(CollisionLeave, this.handleCannotResurrect);
    this.actor.addEventListener(EventType.ResurrectInput, this.handleResurrect);
    this.actor.addEventListener(EventType.SummonInput, this.handleSummon);
  }

  destroy(): void {
    this.actor.removeEventListener(CollisionEnter, this.handleCanResurrect);
    this.actor.removeEventListener(CollisionLeave, this.handleCannotResurrect);
    this.actor.removeEventListener(EventType.SummonInput, this.handleSummon);
  }

  private handleSummon = (): void => {
    if (!this.activeGhosts.length || this.summonCooldown > 0) {
      return;
    }

    const playerTransform = this.actor.getComponent(Transform);

    this.activeGhosts.forEach((ghost) => {
      const ghostTransform = ghost.getComponent(Transform);

      ghostTransform.offsetX = playerTransform.offsetX;
      ghostTransform.offsetY = playerTransform.offsetY;
    });

    this.summonCooldown = SUMMON_COOLDOWN;

    this.actor.dispatchEvent(EventType.Summon);
  };

  private handleCanResurrect = (event: CollisionEnterEvent): void => {
    const { actor } = event;

    if (actor.getComponent(Resurrectable)) {
      this.canResurrect.push(actor);

      const spellbook = this.actor.getComponent(Spellbook);
      spellbook.canResurrect = true;
    }
  };

  private handleCannotResurrect = (event: CollisionLeaveEvent): void => {
    const { actor } = event;

    if (actor.getComponent(Resurrectable)) {
      this.canResurrect = this.canResurrect.filter((item) => item !== actor);
    }

    if (this.canResurrect.length === 0) {
      const spellbook = this.actor.getComponent(Spellbook);
      spellbook.canResurrect = false;
    }
  };

  private handleResurrect = (): void => {
    if (!this.canResurrect.length && !this.activeGhosts.length) {
      this.resurrectLast();
    } else {
      this.resurrectCorpse();
    }
  };

  private handleGhostDeath = (event: ActorEvent): void => {
    const { target } = event;
    this.activeGhosts = this.activeGhosts.filter((ghost) => ghost !== target);
    target.removeEventListener(EventType.Kill, this.handleGhostDeath);
  };

  private resurrectCorpse(): void {
    if (!this.canResurrect.length) {
      return;
    }

    const corpse = this.canResurrect[0].parent;
    if (!(corpse instanceof Actor) || !corpse.templateId) {
      return;
    }

    const ghostTemplateId = RESURRECT_MAP[corpse.templateId];
    const ghost = this.spawnGhost(ghostTemplateId);

    const corpseTransform = corpse.getComponent(Transform);
    const ghostTransform = ghost.getComponent(Transform);

    ghostTransform.offsetX = corpseTransform.offsetX;
    ghostTransform.offsetY = corpseTransform.offsetY;

    corpse.remove();

    this.lastResurrectedId = ghostTemplateId;
  }

  private resurrectLast(): void {
    if (!this.lastResurrectedId) {
      return;
    }

    const ghost = this.spawnGhost(this.lastResurrectedId);

    const playerTransform = this.actor.getComponent(Transform);
    const ghostTransform = ghost.getComponent(Transform);

    ghostTransform.offsetX = playerTransform.offsetX;
    ghostTransform.offsetY = playerTransform.offsetY;
  }

  private spawnGhost(id: string): Actor {
    if (this.activeGhosts.length >= MAX_GHOSTS) {
      const ghost = this.activeGhosts.shift();
      ghost?.dispatchEvent(EventType.Kill);
    }

    const ghost = this.actorSpawner.spawn(id);
    this.activeGhosts.push(ghost);
    ghost.addEventListener(EventType.Kill, this.handleGhostDeath);

    this.scene.appendChild(ghost);

    this.actor.dispatchEvent(EventType.Resurrect);

    return ghost;
  }

  update(options: UpdateOptions): void {
    if (this.summonCooldown >= 0) {
      this.summonCooldown -= options.deltaTime;
    }

    const spellbook = this.actor.getComponent(Spellbook);
    if (this.activeGhosts.length === 0 && this.lastResurrectedId) {
      spellbook.canResurrect = true;
    }
  }
}

PlayerScript.scriptName = 'PlayerScript';
