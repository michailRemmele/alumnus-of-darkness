import { ScriptSystem } from 'remiz';
import { EffectsSystem } from 'remiz-game-systems';

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
import { effectsSystem } from './effects-system';

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
  [EffectsSystem.systemName]: effectsSystem,
};
