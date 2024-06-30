import {
  Actor,
  System,
  Transform,
  Sprite,
  Light,
  Animatable,
  Camera,
  ColliderContainer,
} from 'remiz';
import type {
  Component,
  Scene,
  SystemOptions,
  UpdateOptions,
  ActorEvent,
} from 'remiz';

import { PLAYER_ID } from '../../../consts/templates';
import {
  AI,
  Ghost,
  Resurrectable,
  Health,
  Movement,
} from '../../components';
import * as EventType from '../../events';
import type { DamageEvent } from '../../events';
import { Constructor } from '../../../types/utils';

const GRAVEYARD_CLEAN_FREQUENCY = 1000;
const GRAVEYARD_ENTRIES_LIFETIME = 5000;
const ALLOWED_COMPONENTS = new Set<ComponentConstructor>([
  Movement, Transform, Sprite, Light, Animatable, Camera, Resurrectable, ColliderContainer,
]);

const RESURRECTION_RADIUS = 24;

type ComponentConstructor = Constructor<Component> & { componentName: string };

interface GraveyardEntry {
  actor: Actor
  lifetime: number
}

export class Reaper extends System {
  private scene: Scene;
  private graveyard: Array<GraveyardEntry>;
  private timeCounter: number;

  constructor(options: SystemOptions) {
    super();

    this.scene = options.scene;

    this.graveyard = [];
    this.timeCounter = 0;
  }

  mount(): void {
    this.scene.addEventListener(EventType.Damage, this.handleDamage);
    this.scene.addEventListener(EventType.Kill, this.handleKill);
  }

  unmount(): void {
    this.scene.addEventListener(EventType.Damage, this.handleDamage);
    this.scene.removeEventListener(EventType.Kill, this.handleKill);
  }

  handleDamage = (event: DamageEvent): void => {
    const { target, value } = event;

    const health = target.getComponent(Health);
    if (!health) {
      return;
    }

    health.points -= Math.round(value);

    if (health.points > 0) {
      return;
    }

    if (!target.getComponent(Ghost) && target.getComponent(AI)) {
      const colliderContainer = new ColliderContainer({
        type: 'circleCollider',
        collider: {
          radius: RESURRECTION_RADIUS,
          centerX: 0,
          centerY: 0,
        },
      });
      const resurrectionArea = target.children.find(
        (child) => child.getComponent(Resurrectable),
      );
      resurrectionArea?.setComponent(colliderContainer);
    }

    health.points = 0;
    target.dispatchEvent(EventType.Kill);
  };

  private handleKill = (value: Actor | ActorEvent): void => {
    const actor = value instanceof Actor ? value : value.target;

    // TODO: Remove more components and leave collider only for resurrectable bodies
    actor.getComponents().forEach((component) => {
      if (!ALLOWED_COMPONENTS.has(component.constructor as ComponentConstructor)) {
        actor.removeComponent(component.constructor as ComponentConstructor);
      }
    });

    const isResurrectable = actor.children.some((child) => child.getComponent(Resurrectable));
    if (isResurrectable || actor.id === PLAYER_ID) {
      return;
    }

    this.graveyard.push({
      actor,
      lifetime: GRAVEYARD_ENTRIES_LIFETIME,
    });

    actor.children.forEach((child) => this.handleKill(child));
  };

  update(options: UpdateOptions): void {
    const { deltaTime } = options;

    this.timeCounter += deltaTime;
    if (this.timeCounter >= GRAVEYARD_CLEAN_FREQUENCY) {
      this.graveyard = this.graveyard.filter((entry) => {
        entry.lifetime -= this.timeCounter;

        if (entry.lifetime <= 0) {
          entry.actor.remove();

          return false;
        }

        return true;
      });

      this.timeCounter = 0;
    }
  }
}

Reaper.systemName = 'Reaper';
