import {
  Transform,
  ColliderContainer,
} from 'remiz';
import type {
  Actor,
  Scene,
} from 'remiz';
import { CollisionStay } from 'remiz/events';
import type { CollisionStayEvent } from 'remiz/events';

import * as EventType from '../../../events';
import { PLAYER_ID } from '../../../../consts/templates';
import {
  EnemyDetector,
  Health,
  AI,
  Weapon,
} from '../../../components';
import { IdleState } from '../movement-strategy';
import type { MovementState } from '../movement-strategy';
import { WEAPON_RANGE_FACTOR } from '../consts';
import { getDistance } from '../utils/get-distance';

import { AIStrategy } from './ai-strategy';

const SPAWN_COOLDOWN = 1000;
const PREPARE_TO_ATTACK_COOLDOWN = 500;
const VERTICAL_LIMIT = 12;

export class LightFighterStrategy implements AIStrategy {
  private actor: Actor;
  private cooldown: number;
  private isEnemy: boolean;
  private player: Actor;
  private enemyDetector: Actor;
  private currentEnemy: Actor | undefined;
  private isMeleeEnemy: boolean;
  private prepareToAttack: boolean;

  private movementState: MovementState;

  constructor(actor: Actor, scene: Scene, isEnemy: boolean) {
    this.actor = actor;
    this.isEnemy = isEnemy;
    this.player = scene.getEntityById(PLAYER_ID) as Actor;

    this.cooldown = SPAWN_COOLDOWN;

    this.currentEnemy = undefined;
    this.isMeleeEnemy = false;
    this.prepareToAttack = false;

    this.enemyDetector = actor.children.find((child) => child.getComponent(EnemyDetector)) as Actor;
    this.enemyDetector.addEventListener(CollisionStay, this.handleEnemyDetectorCollision);

    this.movementState = new IdleState(this.actor, !this.isEnemy ? this.player : undefined);
  }

  destroy(): void {
    this.enemyDetector.removeEventListener(CollisionStay, this.handleEnemyDetectorCollision);
  }

  private handleEnemyDetectorCollision = (event: CollisionStayEvent): void => {
    const { actor: enemy } = event;

    const enemyHealth = enemy.getComponent(Health);
    const enemyAI = enemy.getComponent(AI);

    if (this.currentEnemy === enemy) {
      return;
    }
    if (!enemyHealth) {
      return;
    }
    if ((!enemyAI && !this.isEnemy) || (enemyAI?.isEnemy === this.isEnemy)) {
      return;
    }
    if (this.currentEnemy?.getComponent(AI)) {
      return;
    }

    const { offsetY } = this.actor.getComponent(Transform);
    const { offsetY: enemyOffsetY } = enemy.getComponent(Transform);
    if (this.isEnemy && Math.abs(offsetY - enemyOffsetY) >= VERTICAL_LIMIT) {
      return;
    }

    this.currentEnemy = enemy;
    this.movementState.target = enemy;
  };

  private updateAggro(): void {
    if (!this.currentEnemy) {
      return;
    }

    const enemyDetectorCollider = this.enemyDetector.getComponent(ColliderContainer);

    const distance = getDistance(this.actor, this.currentEnemy);

    const evadeRange = (enemyDetectorCollider.collider as { radius: number }).radius * 1.5;

    if (distance > evadeRange || !this.currentEnemy.getComponent(Health)) {
      this.currentEnemy = undefined;
      this.movementState.target = !this.isEnemy ? this.player : undefined;
      this.prepareToAttack = false;
    }
  }

  private updateMeleeEnemies(): void {
    const weapon = this.actor.getComponent(Weapon);

    if (!this.currentEnemy) {
      return;
    }
    if (this.prepareToAttack) {
      return;
    }

    const distance = getDistance(this.actor, this.currentEnemy);

    this.isMeleeEnemy = distance <= weapon.properties.range * WEAPON_RANGE_FACTOR;

    if (this.isMeleeEnemy && weapon.cooldownRemaining <= 0) {
      this.cooldown = PREPARE_TO_ATTACK_COOLDOWN;
      this.prepareToAttack = true;
    }
  }

  private attack(): void {
    if (!this.isMeleeEnemy || this.cooldown > 0) {
      return;
    }

    const weapon = this.actor.getComponent(Weapon);

    if (weapon.cooldownRemaining > 0) {
      return;
    }

    if (!this.currentEnemy) {
      return;
    }

    const { offsetX: enemyX, offsetY: enemyY } = this.currentEnemy.getComponent(Transform);

    this.actor.dispatchEvent(EventType.Attack, {
      x: enemyX,
      y: enemyY,
    });

    this.prepareToAttack = false;
  }

  update(deltaTime: number): void {
    this.cooldown -= deltaTime;

    if (this.currentEnemy) {
      this.updateAggro();
      this.updateMeleeEnemies();
      this.attack();
    }

    this.movementState = this.movementState.update(deltaTime);
  }
}
