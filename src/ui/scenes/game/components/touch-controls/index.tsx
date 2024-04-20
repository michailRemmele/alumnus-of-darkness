import { useContext, useCallback, useMemo } from 'react';
import type { FC } from 'react';

import { EngineContext } from '../../../../providers';
import * as EventType from '../../../../../game/events';
import { PLAYER_ID } from '../../../../../consts/templates';
import { useCanResurrect } from '../../../../hooks/use-can-resurrect';
import { TouchButton } from '../touch-button';

import './style.css';

export const TouchControls: FC = () => {
  const { scene } = useContext(EngineContext);

  const player = useMemo(() => scene.getEntityById(PLAYER_ID), [scene]);

  const canResurrect = useCanResurrect();

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
        <div className="touch-controls__action">
          <TouchButton
            onClick={handleSummonClick}
            title="S"
          />
        </div>
        <div className="touch-controls__action">
          <TouchButton
            onClick={handleResurrectClick}
            title="R"
            disabled={!canResurrect}
          />
        </div>
      </div>
      <div className="touch-controls__row">
        <div className="touch-controls__jump">
          <TouchButton
            onClick={handleJumpClick}
            size="l"
            title="J"
          />
        </div>
      </div>
    </div>
  );
};
