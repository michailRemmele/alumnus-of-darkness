import { Transform, ColliderContainer } from 'remiz';
import type { Actor } from 'remiz';

import type { BoxCollider, CircleCollider } from '../../types/collider';

const getHalfSizeY = (container?: ColliderContainer): number => {
  if (!container) {
    return 0;
  }
  if (container.type === 'boxCollider') {
    return (container.collider as BoxCollider).sizeY / 2;
  }
  return (container.collider as CircleCollider).radius;
};

export const getAlignedTransformY = (actor1: Actor, actor2: Actor): number => {
  const { offsetY: offsetY2 } = actor2.getComponent(Transform);

  const container1 = actor1.getComponent(ColliderContainer) as ColliderContainer | undefined;
  const container2 = actor2.getComponent(ColliderContainer) as ColliderContainer | undefined;

  const bottomY = offsetY2 + getHalfSizeY(container2) + (container2?.collider.centerY ?? 0);

  return bottomY - getHalfSizeY(container1) - (container1?.collider.centerY ?? 0);
};
