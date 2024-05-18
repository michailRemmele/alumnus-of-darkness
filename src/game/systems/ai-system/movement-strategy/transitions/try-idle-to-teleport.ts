import type { Actor } from 'remiz';
import { RigidBody } from 'remiz';

import type { MovementState } from '../movement-state';
import { TeleportState } from '../teleport-state';
import { AI, Weapon, Ghost } from '../../../../components';
import { getDistanceY, getDistance } from '../../utils/get-distance';
import { FOLLOW_DISTANCE_Y, WEAPON_RANGE_FACTOR } from '../../consts';

export const tryIdleToTeleport = (actor: Actor, target?: Actor): MovementState | undefined => {
  if (!target || !actor.getComponent(Ghost)) {
    return undefined;
  }

  const ai = actor.getComponent(AI);
  const targetAI = target.getComponent(AI) as AI | undefined;
  const targetRigidBody = target.getComponent(RigidBody) as RigidBody | undefined;
  const velocity = targetRigidBody?.velocity;

  const weapon = actor.getComponent(Weapon);

  const isTargetFiendly = ai.isEnemy === Boolean(targetAI?.isEnemy);

  if (velocity && (velocity.x !== 0 || velocity.y !== 0)) {
    return undefined;
  }

  const distanceY = getDistanceY(actor, target);
  if (isTargetFiendly && distanceY > FOLLOW_DISTANCE_Y) {
    return new TeleportState(actor, target);
  }

  const distance = getDistance(actor, target);
  if (!isTargetFiendly && distance > weapon.properties.range * WEAPON_RANGE_FACTOR) {
    return new TeleportState(actor, target);
  }
  return undefined;
};
