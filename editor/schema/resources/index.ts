import { ScriptSystem } from 'remiz';

import {
  PlayerScript,
  MoonScript,
  PlatformScript,
} from '../../../src/game/scripts';

import { playerScript, moonScript, platformScript } from './script-system';

export const resourcesSchema = {
  [ScriptSystem.systemName]: {
    [PlayerScript.scriptName]: playerScript,
    [MoonScript.scriptName]: moonScript,
    [PlatformScript.scriptName]: platformScript,
  },
};
