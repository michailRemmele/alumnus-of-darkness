import type { Actor } from 'remiz';
import { RigidBody } from 'remiz';

import type { MovementState } from '../movement-state';
import { TeleportState } from '../teleport-state';
import { AI, Weapon, Ghost } from '../../../../components';
import { getDistanceY } from '../../utils/get-distance';
import { FOLLOW_DISTANCE_Y } from '../../consts';

export const tryIdleToTeleport = (actor: Actor, target?: Actor): MovementState | undefined => {
  if (!target || !actor.getComponent(Ghost)) {
    return undefined;
  }

  const ai = actor.getComponent(AI);
  const targetAI = target.getComponent(AI) as AI | undefined;

  const weapon = actor.getComponent(Weapon);
  const rigidBody = actor.getComponent(RigidBody);

  const isTargetFiendly = ai.isEnemy === Boolean(targetAI?.isEnemy);

  if (rigidBody.velocity && (rigidBody.velocity.x !== 0 || rigidBody.velocity.y !== 0)) {
    return undefined;
  }

  const distanceY = getDistanceY(actor, target);
  const conditionDistance = isTargetFiendly ? FOLLOW_DISTANCE_Y : weapon.properties.range;
  if (distanceY > conditionDistance) {
    return new TeleportState(actor, target);
  }
  return undefined;
};
