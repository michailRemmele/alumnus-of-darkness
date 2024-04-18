import type {
  ScriptOptions,
  Scene,
} from 'remiz';
import {
  Actor,
  Script,
  Transform,
  CameraService,
} from 'remiz';

const MOON_OFFSET_X = -44;

export class MoonScript extends Script {
  private scene: Scene;
  private actor: Actor;
  private cameraService: CameraService;

  constructor(options: ScriptOptions) {
    super();

    this.scene = options.scene;
    this.actor = options.actor;

    this.cameraService = this.scene.getService(CameraService);
  }

  update(): void {
    const camera = this.cameraService.getCurrentCamera();
    const cameraTransform = camera.getComponent(Transform);

    const moonTransform = this.actor.getComponent(Transform);

    moonTransform.offsetX = cameraTransform.offsetX + MOON_OFFSET_X;
  }
}

MoonScript.scriptName = 'MoonScript';
