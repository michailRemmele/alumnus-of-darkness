import type { Actor } from 'remiz';

import type { MovementState } from '../movement-state';
import { TeleportState } from '../teleport-state';
import { AI, Weapon, Ghost } from '../../../../components';
import { getDistance } from '../../utils/get-distance';

export const tryFollowToTeleport = (actor: Actor, target?: Actor): MovementState | undefined => {
  if (!target || !actor.getComponent(Ghost)) {
    return undefined;
  }

  const ai = actor.getComponent(AI);
  const targetAI = target.getComponent(AI) as AI | undefined;

  const weapon = actor.getComponent(Weapon);

  const isTargetFiendly = ai.isEnemy === Boolean(targetAI?.isEnemy);

  const distance = getDistance(actor, target);
  if (!isTargetFiendly && weapon.type === 'melee' && distance > weapon.properties.range * 2) {
    return new TeleportState(actor, target);
  }

  return undefined;
};
