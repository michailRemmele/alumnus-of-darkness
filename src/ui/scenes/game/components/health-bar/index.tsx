import { useContext, useState, useEffect } from 'react';
import type { FC } from 'react';

import { EngineContext } from '../../../../providers';
import { PLAYER_ID } from '../../../../../consts/templates';
import { Health } from '../../../../../game/components';

import './style.css';

export const HealthBar: FC = () => {
  const { scene, gameStateObserver } = useContext(EngineContext);

  const [points, setPoints] = useState(100);
  const [maxPoints, setMaxPoints] = useState(100);

  useEffect(() => {
    const handleUpdate = (): void => {
      const player = scene.getEntityById(PLAYER_ID);
      const health = player?.getComponent(Health);

      setPoints(health?.points ?? 0);
      setMaxPoints(health?.maxPoints ?? 100);
    };

    gameStateObserver.subscribe(handleUpdate);
    return () => gameStateObserver.unsubscribe(handleUpdate);
  }, []);

  return (
    <div className="health-bar">
      <div
        className="health-bar__points"
        style={{ width: `${maxPoints ? ((points / maxPoints) * 100) : 0}%` }}
      />
    </div>
  );
};
