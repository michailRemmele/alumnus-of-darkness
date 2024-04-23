import type {
  ScriptOptions,
} from 'remiz';
import {
  Script,
  RigidBody,
} from 'remiz';

export class PlatformScript extends Script {
  constructor(options: ScriptOptions) {
    super();

    const rigidBody = options.actor.getComponent(RigidBody);
    rigidBody.isPlatform = true;
  }
}

PlatformScript.scriptName = 'PlatformScript';
