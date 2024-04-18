import { useContext, useState, useEffect } from 'react';
import type { FC } from 'react';

import { EngineContext } from '../../../../providers';
import { PLAYER_ID } from '../../../../../consts/templates';
import { Mana } from '../../../../../game/components';

import './style.css';

export const ManaBar: FC = () => {
  const { scene, gameStateObserver } = useContext(EngineContext);

  const [points, setPoints] = useState(100);
  const [maxPoints, setMaxPoints] = useState(100);

  useEffect(() => {
    const handleUpdate = (): void => {
      const player = scene.getEntityById(PLAYER_ID);
      const mana = player?.getComponent(Mana);

      setPoints(mana?.points ?? 0);
      setMaxPoints(mana?.maxPoints ?? 100);
    };

    gameStateObserver.subscribe(handleUpdate);
    return () => gameStateObserver.unsubscribe(handleUpdate);
  }, []);

  return (
    <div className="mana-bar">
      <div
        className="mana-bar__points"
        style={{ width: `${maxPoints ? ((points / maxPoints) * 100) : 0}%` }}
      />
    </div>
  );
};
