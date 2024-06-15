import { ScriptSystem } from 'remiz';

import {
  PlayerScript,
  MoonScript,
  PlatformScript,
  CameraScript,
  GroundDetectorScript,
  GhostScript,
  CloudsScript,
} from '../../../src/game/scripts';

import {
  playerScript,
  moonScript,
  platformScript,
  cameraScript,
  groundDetectorScript,
  ghostScript,
  cloudsScript,
} from './script-system';

export const resourcesSchema = {
  [ScriptSystem.systemName]: {
    [PlayerScript.scriptName]: playerScript,
    [MoonScript.scriptName]: moonScript,
    [PlatformScript.scriptName]: platformScript,
    [CameraScript.scriptName]: cameraScript,
    [GroundDetectorScript.scriptName]: groundDetectorScript,
    [GhostScript.scriptName]: ghostScript,
    [CloudsScript.scriptName]: cloudsScript,
  },
};
