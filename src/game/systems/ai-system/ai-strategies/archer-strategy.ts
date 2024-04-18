import {
  MathOps,
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

import { AIStrategy } from './ai-strategy';

const SPAWN_COOLDOWN = 1000;
const PREPARE_TO_ATTACK_COOLDOWN = 500;
const RANGE_RADIUS = 120;

const FOLLOW_DISTANCE = 48;

export class ArcherStrategy implements AIStrategy {
  private actor: Actor;
  private cooldown: number;
  private isEnemy: boolean;
  private player: Actor;
  private enemyDetector: Actor;
  private currentEnemy: Actor | undefined;
  private isRangeEnemy: boolean;
  private prepareToAttack: boolean;

  constructor(actor: Actor, scene: Scene, isEnemy: boolean) {
    this.actor = actor;
    this.isEnemy = isEnemy;
    this.player = scene.getEntityById(PLAYER_ID) as Actor;

    this.cooldown = SPAWN_COOLDOWN;

    this.currentEnemy = undefined;
    this.isRangeEnemy = false;
    this.prepareToAttack = false;

    this.enemyDetector = actor.children.find((child) => child.getComponent(EnemyDetector)) as Actor;
    this.enemyDetector.addEventListener(CollisionStay, this.handleEnemyDetectorCollision);
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
    if (
      (!enemyAI && !this.isEnemy)
      || (enemyAI?.isEnemy === this.isEnemy)
      || (this.isEnemy && enemyAI)
    ) {
      return;
    }
    if (this.currentEnemy?.getComponent(AI)) {
      return;
    }

    this.currentEnemy = enemy;
  };

  private updateAggro(): void {
    if (!this.currentEnemy) {
      return;
    }

    const actorTransform = this.actor.getComponent(Transform);
    const enemyTransform = this.currentEnemy.getComponent(Transform);

    const enemyDetectorCollider = this.enemyDetector.getComponent(ColliderContainer);

    const distance = MathOps.getDistanceBetweenTwoPoints(
      actorTransform.offsetX,
      enemyTransform.offsetX,
      actorTransform.offsetY,
      enemyTransform.offsetY,
    );

    const evadeRange = (enemyDetectorCollider.collider as { radius: number }).radius * 2;

    if (distance > evadeRange || !this.currentEnemy.getComponent(Health)) {
      this.currentEnemy = undefined;
    }
  }

  private updateRangeEnemies(): void {
    const weapon = this.actor.getComponent(Weapon);

    if (!this.currentEnemy) {
      return;
    }
    if (this.prepareToAttack) {
      return;
    }

    const enemyTransform = this.currentEnemy.getComponent(Transform);
    const actorTransform = this.actor.getComponent(Transform);

    const distance = MathOps.getDistanceBetweenTwoPoints(
      enemyTransform.offsetX,
      actorTransform.offsetX,
      enemyTransform.offsetY,
      actorTransform.offsetY,
    );

    this.isRangeEnemy = distance <= RANGE_RADIUS;

    if (this.isRangeEnemy && weapon.cooldownRemaining <= 0) {
      this.cooldown = PREPARE_TO_ATTACK_COOLDOWN;
      this.prepareToAttack = true;
    }
  }

  private attack(): void {
    if (!this.isRangeEnemy || this.cooldown > 0) {
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

  private move(): void {
    if (this.isRangeEnemy || this.prepareToAttack || this.cooldown > 0) {
      return;
    }

    if (!this.currentEnemy) {
      return;
    }

    const { offsetX: enemyX } = this.currentEnemy.getComponent(Transform);
    const { offsetX } = this.actor.getComponent(Transform);

    this.actor.dispatchEvent(
      enemyX > offsetX ? EventType.MoveRight : EventType.MoveLeft,
    );
  }

  private follow(): void {
    if (this.currentEnemy) {
      return;
    }

    const playerTransform = this.player.getComponent(Transform);
    const actorTransform = this.actor.getComponent(Transform);

    const distance = MathOps.getDistanceBetweenTwoPoints(
      playerTransform.offsetX,
      actorTransform.offsetX,
      playerTransform.offsetY,
      actorTransform.offsetY,
    );

    if (distance <= FOLLOW_DISTANCE) {
      return;
    }

    this.actor.dispatchEvent(
      playerTransform.offsetX > actorTransform.offsetX ? EventType.MoveRight : EventType.MoveLeft,
    );
  }

  update(deltaTime: number): void {
    this.cooldown -= deltaTime;

    if (this.currentEnemy) {
      this.updateAggro();
      this.updateRangeEnemies();
      this.attack();
      this.move();
    } else if (!this.isEnemy) {
      this.follow();
    }
  }
}
