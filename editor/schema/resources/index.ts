import { ScriptSystem } from 'remiz';

import {
  PlayerScript,
  MoonScript,
} from '../../../src/game/scripts';

import { playerScript, moonScript } from './script-system';

export const resourcesSchema = {
  [ScriptSystem.systemName]: {
    [PlayerScript.scriptName]: playerScript,
    [MoonScript.scriptName]: moonScript,
  },
};
