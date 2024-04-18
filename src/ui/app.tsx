import { useContext } from 'react';
import type { FC } from 'react';

import { MAIN_MENU_ID, GAME_ID } from '../consts/scenes';

import { EngineContext } from './providers';
import { MainMenu, Game } from './scenes';

export const App: FC = () => {
  const { scene } = useContext(EngineContext);

  return (
    <>
      {scene.id === MAIN_MENU_ID && <MainMenu />}
      {scene.id === GAME_ID && <Game />}
    </>
  );
};
