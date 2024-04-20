import { useContext, useCallback, useMemo } from 'react';
import type { FC } from 'react';

import { EngineContext } from '../../../../providers';
import * as EventType from '../../../../../game/events';
import { PLAYER_ID } from '../../../../../consts/templates';

import './style.css';

export const TouchControls: FC = () => {
  const { scene } = useContext(EngineContext);

  const player = useMemo(() => scene.getEntityById(PLAYER_ID), [scene]);

  const handleJumpClick = useCallback(() => {
    player?.dispatchEvent(EventType.MoveJump);
  }, [scene]);

  const handleResurrectClick = useCallback(() => {
    player?.dispatchEvent(EventType.ResurrectInput);
  }, [scene]);

  const handleSummonClick = useCallback(() => {
    player?.dispatchEvent(EventType.SummonInput);
  }, [scene]);

  return (
    <div className="touch-controls">
      <div className="touch-controls__row">
        <button
          className="touch-controls__button"
          type="button"
          onClick={handleResurrectClick}
        >
          R
        </button>
      </div>
      <div className="touch-controls__row">
        <button
          className="touch-controls__button"
          type="button"
          onClick={handleSummonClick}
        >
          S
        </button>
        <button
          className="touch-controls__button touch-controls__button_s"
          type="button"
          onClick={handleJumpClick}
        >
          J
        </button>
      </div>
    </div>
  );
};
