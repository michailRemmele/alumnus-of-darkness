import { useCallback, useContext } from 'react';
import type { FC } from 'react';
import { LoadScene } from 'remiz/events';

import { EngineContext } from '../../providers';
import { GAME_ID } from '../../../consts/scenes';

import './style.css';

export const MainMenu: FC = () => {
  const { scene } = useContext(EngineContext);

  const handlePlay = useCallback(() => {
    scene.dispatchEvent(LoadScene, {
      sceneId: GAME_ID,
      clean: true,
      loaderId: null,
      levelId: null,
    });
  }, [scene]);

  return (
    <div className="main-menu">
      <img
        src="./images/logo.png"
        alt="Alumnus of Darkness"
        className="main-menu__logo"
      />
      <button className="main-menu__button" type="button" onClick={handlePlay}>Play</button>
      <ul className="action-list">
        <li className="action-list__item">
          <div className="action-button">
            <span className="action-button__key">W</span>
            <span className="action-button__key">A</span>
            <span className="action-button__key">S</span>
            <span className="action-button__key">D</span>
            <div className="action-button__label">
              Move
            </div>
          </div>
        </li>
        <li className="action-list__item">
          <div className="action-button">
            <span className="action-button__key">E</span>
            <div className="action-button__label">
              Resurrect
            </div>
          </div>
        </li>
        <li className="action-list__item">
          <div className="action-button">
            <span className="action-button__key">Q</span>
            <div className="action-button__label">
              Summon
            </div>
          </div>
        </li>
        <li className="action-list__item">
          <div className="action-button">
            <span className="action-button__key action-button__key--space">SPACE</span>
            <div className="action-button__label">
              Jump
            </div>
          </div>
        </li>
      </ul>
    </div>
  );
};
