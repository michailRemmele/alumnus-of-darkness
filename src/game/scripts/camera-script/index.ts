import type {
  ScriptOptions,
} from 'remiz';
import {
  Actor,
  Script,
  Camera,
} from 'remiz';

const VIEWPORT_HEIGHT = 144;

export class CameraScript extends Script {
  private actor: Actor;

  constructor(options: ScriptOptions) {
    super();

    this.actor = options.actor;

    this.updateZoom();
  }

  private updateZoom(): void {
    const camera = this.actor.getComponent(Camera);
    camera.zoom = camera.windowSizeY / VIEWPORT_HEIGHT;
  }

  update(): void {
    this.updateZoom();
  }
}

CameraScript.scriptName = 'CameraScript';
