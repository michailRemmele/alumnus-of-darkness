import {
  Actor,
  System,
  ActorCollection,
} from 'remiz';
import type {
  Scene,
  SystemOptions,
  UpdateOptions,
  ActorEvent,
} from 'remiz';

import { PLAYER_ID } from '../../../consts/templates';
import { Resurrectable } from '../../components';
import * as EventType from '../../events';

const GRAVEYARD_CLEAN_FREQUENCY = 1000;
const GRAVEYARD_ENTRIES_LIFETIME = 2000;

interface GraveyardEntry {
  actor: Actor
  lifetime: number
}

export class Reaper extends System {
  private scene: Scene;
  private actorCollection: ActorCollection;
  private graveyard: Array<GraveyardEntry>;
  private timeCounter: number;

  constructor(options: SystemOptions) {
    super();

    this.scene = options.scene;
    this.actorCollection = new ActorCollection(options.scene);

    this.graveyard = [];
    this.timeCounter = 0;
  }

  mount(): void {
    this.scene.addEventListener(EventType.Kill, this.handleKill);
  }

  unmount(): void {
    this.scene.removeEventListener(EventType.Kill, this.handleKill);
  }

  private handleKill = (value: Actor | ActorEvent): void => {
    const actor = value instanceof Actor ? value : value.target;

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
