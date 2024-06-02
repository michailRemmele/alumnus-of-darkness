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
import { Resurrectable, Spellbook, Mana } from '../../components';

const RESURRECT_COOLDOWN = 500;
const SUMMON_COOLDOWN = 2000;
const MAX_GHOSTS = 2;

export class PlayerScript extends Script {
  private scene: Scene;
  private actor: Actor;
  private actorSpawner: ActorSpawner;
  private canResurrect: Array<Actor>;
  private activeGhosts: Array<Actor>;
  private resurrectCooldown: number;
  private summonCooldown: number;

  constructor(options: ScriptOptions) {
    super();

    this.scene = options.scene;
    this.actor = options.actor;
    this.actorSpawner = options.actorSpawner;
    this.canResurrect = [];
    this.activeGhosts = [];
    this.resurrectCooldown = 0;
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
    const { actor, target } = event;

    if (target !== this.actor) {
      return;
    }

    if (actor.getComponent(Resurrectable)) {
      this.canResurrect.push(actor);

      const spellbook = this.actor.getComponent(Spellbook);
      spellbook.canResurrect = true;
    }
  };

  private handleCannotResurrect = (event: CollisionLeaveEvent): void => {
    const { actor, target } = event;

    if (target !== this.actor) {
      return;
    }

    if (actor.getComponent(Resurrectable)) {
      this.canResurrect = this.canResurrect.filter((item) => item !== actor);
    }

    if (this.canResurrect.length === 0) {
      const spellbook = this.actor.getComponent(Spellbook);
      spellbook.canResurrect = false;
    }
  };

  private handleResurrect = (): void => {
    if (!this.canResurrect.length || this.resurrectCooldown > 0) {
      return;
    }

    const corpse = this.canResurrect[0];
    const resurrectable = corpse.getComponent(Resurrectable);

    const manacost = resurrectable.cost;
    const mana = this.actor.getComponent(Mana);

    if (manacost > mana.points) {
      return;
    }

    mana.points -= manacost;
    const ghost = this.spawnGhost(resurrectable.creature);

    const corpseTransform = corpse.getComponent(Transform);
    const ghostTransform = ghost.getComponent(Transform);

    ghostTransform.offsetX = corpseTransform.offsetX;
    ghostTransform.offsetY = corpseTransform.offsetY;

    if (!resurrectable.permanent && corpse.parent instanceof Actor) {
      corpse.parent?.remove();
    }

    this.resurrectCooldown = RESURRECT_COOLDOWN;
  };

  private handleGhostDeath = (event: ActorEvent): void => {
    const { target } = event;
    this.activeGhosts = this.activeGhosts.filter((ghost) => ghost !== target);
    target.removeEventListener(EventType.Kill, this.handleGhostDeath);
  };

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
    if (this.resurrectCooldown >= 0) {
      this.resurrectCooldown -= options.deltaTime;
    }
    if (this.summonCooldown >= 0) {
      this.summonCooldown -= options.deltaTime;
    }

    const mana = this.actor.getComponent(Mana);
    mana.points = Math.min(
      mana.maxPoints,
      mana.points + mana.refillRate * (options.deltaTime / 1000),
    );
  }
}

PlayerScript.scriptName = 'PlayerScript';
