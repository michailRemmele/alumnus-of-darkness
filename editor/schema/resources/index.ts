import { ScriptSystem } from 'remiz';

import {
  PlayerScript,
  MoonScript,
  PlatformScript,
  CameraScript,
} from '../../../src/game/scripts';

import {
  playerScript, moonScript, platformScript, cameraScript,
} from './script-system';

export const resourcesSchema = {
  [ScriptSystem.systemName]: {
    [PlayerScript.scriptName]: playerScript,
    [MoonScript.scriptName]: moonScript,
    [PlatformScript.scriptName]: platformScript,
    [CameraScript.scriptName]: cameraScript,
  },
};
