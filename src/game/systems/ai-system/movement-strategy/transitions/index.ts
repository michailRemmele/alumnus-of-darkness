import { tryIdleToFollow } from './try-idle-to-follow';
import { tryIdleToTeleport } from './try-idle-to-teleport';
import { tryFollowToIdle } from './try-follow-to-idle';

export const idleTransitions = [
  tryIdleToFollow,
  tryIdleToTeleport,
];

export const followTransitions = [
  tryFollowToIdle,
];
