import {
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from 'react';
import type { FC } from 'react';
import { ActorCollection } from 'remiz';
import { LoadScene } from 'remiz/events';

import { AI } from '../../../game/components';
import { EngineContext } from '../../providers';
import { PLAYER_ID } from '../../../consts/templates';
import { GAME_ID } from '../../../consts/scenes';
import * as EventType from '../../../game/events';

import {
  HealthBar,
  // ManaBar,
  ResurrectButton,
} from './components';
import './style.css';

export const Game: FC = () => {
  const { scene, gameStateObserver } = useContext(EngineContext);

  const [isGameOver, setIsGameOver] = useState(false);
  const [isVictory, setIsVictory] = useState(false);

  const aiCollection = useMemo(() => new ActorCollection(scene, { components: [AI] }), []);

  const handleRestart = useCallback(() => {
    scene.dispatchEvent(LoadScene, {
      sceneId: GAME_ID,
      loaderId: null,
      levelId: null,
      unloadCurrent: true,
      clean: true,
    });
  }, []);

  useEffect(() => {
    const player = scene.getEntityById(PLAYER_ID);

    const handleKill = (): void => {
      setIsGameOver(true);
    };

    player?.addEventListener(EventType.Kill, handleKill);

    const handleUpdate = (): void => {
      let isNoEnemy = true;
      aiCollection.forEach((actor) => {
        if (actor.getComponent(AI)?.isEnemy) {
          isNoEnemy = false;
        }
      });

      if (isNoEnemy) {
        setIsVictory(true);
      }
    };

    gameStateObserver.subscribe(handleUpdate);

    return () => {
      player?.removeEventListener(EventType.Kill, handleKill);
      gameStateObserver.unsubscribe(handleUpdate);
    };
  }, []);

  return (
    <div className="game">
      <div className="game__header">
        <HealthBar />
        {/* <ManaBar /> */}
      </div>
      <div className="game__footer">
        <ResurrectButton />
      </div>
      {(isGameOver || isVictory) && (
        <div className="game-over__overlay">
          <div className="game-over__content">
            <h1 className="game-over__title">
              {isGameOver ? 'Game Over' : 'Victory' }
            </h1>
            <button className="game-over__button" type="button" onClick={handleRestart}>Restart</button>
          </div>
        </div>
      )}
    </div>
  );
};
