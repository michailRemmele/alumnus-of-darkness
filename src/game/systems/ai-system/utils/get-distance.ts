import type { Actor } from 'remiz';
import { Transform, MathOps } from 'remiz';

export const getDistance = (actor1: Actor, actor2: Actor): number => {
  const actor1Transform = actor1.getComponent(Transform);
  const actor2Transform = actor2.getComponent(Transform);

  return MathOps.getDistanceBetweenTwoPoints(
    actor1Transform.offsetX,
    actor2Transform.offsetX,
    actor1Transform.offsetY,
    actor2Transform.offsetY,
  );
};

export const getDistanceX = (actor1: Actor, actor2: Actor): number => {
  const actor1Transform = actor1.getComponent(Transform);
  const actor2Transform = actor2.getComponent(Transform);

  return Math.abs(actor1Transform.offsetX - actor2Transform.offsetX);
};

export const getDistanceY = (actor1: Actor, actor2: Actor): number => {
  const actor1Transform = actor1.getComponent(Transform);
  const actor2Transform = actor2.getComponent(Transform);

  return Math.abs(actor1Transform.offsetY - actor2Transform.offsetY);
};
