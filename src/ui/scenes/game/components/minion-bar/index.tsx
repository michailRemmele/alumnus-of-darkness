import { useContext, useState, useEffect } from 'react';
import type { FC } from 'react';

import { EngineContext } from '../../../../providers';
import { PLAYER_ID } from '../../../../../consts/templates';
import { Spellbook, Health, UI } from '../../../../../game/components';
import * as EventType from '../../../../../game/events';

import { isArraysEqualByValue } from './utils';

import './style.css';

interface Minion {
  id: string
  hp: number
  maxHP: number
  avatarUrl: string
  selected: boolean
}

export const MinionBar: FC = () => {
  const { scene, gameStateObserver } = useContext(EngineContext);

  const [minions, setMinions] = useState<Array<Minion>>([]);

  useEffect(() => {
    const handleUpdate = (): void => {
      const player = scene.getEntityById(PLAYER_ID);
      const spellbook = player?.getComponent(Spellbook);

      const nextMinions = spellbook?.activeMinions
        .filter((ghost) => ghost.getComponent(Health))
        .map(((ghost) => {
          const health = ghost.getComponent(Health);
          const ui = ghost.getComponent(UI);
          return {
            id: ghost.id,
            hp: health.points,
            maxHP: health.maxPoints,
            avatarUrl: ui.avatarUrl,
            selected: spellbook.selectedGhost === ghost.id,
          };
        }));

      setMinions((prevMinions) => {
        if (!nextMinions || isArraysEqualByValue(prevMinions, nextMinions)) {
          return prevMinions;
        }
        return nextMinions;
      });
    };

    gameStateObserver.subscribe(handleUpdate);
    return () => gameStateObserver.unsubscribe(handleUpdate);
  }, []);

  return (
    <div className="minion-bar">
      {minions.map((minion, index) => (
        <div
          key={minion.id}
          className={`minion ${minion.selected ? 'minion_selected' : ''}`}
          onClick={() => scene.dispatchEvent(EventType.SelectMinion, { index })}
        >
          <img src={minion.avatarUrl} alt={minion.id} className="minion__avatar" />
          <div className="minion__health-bar">
            <div
              className="minion__points"
              style={{ width: `${(minion.hp / minion.maxHP) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};
