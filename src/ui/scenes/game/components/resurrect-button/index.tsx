import { useContext, useState, useEffect } from 'react';
import type { FC } from 'react';

import { EngineContext } from '../../../../providers';
import { PLAYER_ID } from '../../../../../consts/templates';
import { Spellbook } from '../../../../../game/components';

import './style.css';

export const ResurrectButton: FC = () => {
  const { scene, gameStateObserver } = useContext(EngineContext);

  const [canResurrect, setCanResurrect] = useState(false);

  useEffect(() => {
    const handleUpdate = (): void => {
      const player = scene.getEntityById(PLAYER_ID);
      const spellbook = player?.getComponent(Spellbook);

      setCanResurrect(spellbook?.canResurrect ?? false);
    };

    gameStateObserver.subscribe(handleUpdate);
    return () => gameStateObserver.unsubscribe(handleUpdate);
  }, []);

  if (!canResurrect) {
    return null;
  }

  return (
    <div className="action-button">
      <div className="action-button__key">E</div>
      <div className="action-button__label">Resurrect</div>
    </div>
  );
};
