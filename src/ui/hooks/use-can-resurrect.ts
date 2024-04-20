import { useContext, useState, useEffect } from 'react';

import { EngineContext } from '../providers';
import { PLAYER_ID } from '../../consts/templates';
import { Spellbook } from '../../game/components';

export const useCanResurrect = (): boolean => {
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

  return canResurrect;
};
