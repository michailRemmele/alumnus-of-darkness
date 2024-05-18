import type { Actor } from 'remiz';

import type { MovementState } from '../movement-state';
import { IdleState } from '../idle-state';
import { AI, Weapon } from '../../../../components';
import { getDistanceX } from '../../utils/get-distance';
import { FOLLOW_DISTANCE_X, WEAPON_RANGE_FACTOR } from '../../consts';

export const tryFollowToIdle = (actor: Actor, target?: Actor): MovementState | undefined => {
  if (!target) {
    return new IdleState(actor, target);
  }

  const ai = actor.getComponent(AI);
  const targetAI = target.getComponent(AI) as AI | undefined;

  const weapon = actor.getComponent(Weapon);

  const isTargetFiendly = ai.isEnemy === Boolean(targetAI?.isEnemy);

  const distanceX = getDistanceX(actor, target);
  const conditionDistance = isTargetFiendly
    ? FOLLOW_DISTANCE_X
    : weapon.properties.range * WEAPON_RANGE_FACTOR;
  if (distanceX <= conditionDistance) {
    return new IdleState(actor, target);
  }
  return undefined;
};
