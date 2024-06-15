import type {
  ScriptOptions,
  Scene,
  UpdateOptions,
} from 'remiz';
import {
  Actor,
  Script,
  Transform,
  Camera,
  CameraService,
  MathOps,
  ActorSpawner,
} from 'remiz';

import {
  CLOUD_1_ID,
  CLOUD_2_ID,
  CLOUD_3_ID,
} from '../../../consts/templates';

const CLOUD_IDS = [
  CLOUD_1_ID,
  CLOUD_2_ID,
  CLOUD_3_ID,
];
const OFFSET_Y_MIN = -72;
const OFFSET_Y_MAX = -24;
const CLOUD_SIZE = 96;
const SPEED = 0.5;
const FIXED_STEP = 0.5;
const INTERVAL = (CLOUD_SIZE / SPEED) * 1000;

export class CloudsScript extends Script {
  private scene: Scene;
  private actor: Actor;
  private actorSpawner: ActorSpawner;
  private cameraService: CameraService;
  private timeout: number;
  private clouds: Array<Actor>;
  private step: number;

  constructor(options: ScriptOptions) {
    super();

    this.scene = options.scene;
    this.actor = options.actor;
    this.actorSpawner = options.actorSpawner;

    this.cameraService = this.scene.getService(CameraService);

    this.timeout = 0;
    this.clouds = [];

    this.step = 0;

    this.spawnInitial();
  }

  private spawnInitial(): void {
    const cameraActor = this.cameraService.getCurrentCamera();
    const camera = cameraActor.getComponent(Camera);

    const offsetX = (camera.windowSizeX / camera.zoom) / 2;

    for (let x = -offsetX; x <= offsetX; x += CLOUD_SIZE) {
      this.spawnCloud(x);
    }
  }

  private updateClouds(deltaTime: number): void {
    this.step += SPEED * (deltaTime / 1000);
    if (this.step < FIXED_STEP) {
      return;
    }

    const step = Math.floor(this.step / FIXED_STEP);
    this.step %= FIXED_STEP;

    const cameraActor = this.cameraService.getCurrentCamera();
    const camera = cameraActor.getComponent(Camera);

    const edge = -(camera.windowSizeX / camera.zoom) / 2 - CLOUD_SIZE / 2;

    this.clouds = this.clouds.filter((actor) => {
      const transform = actor.getComponent(Transform);
      transform.offsetX -= step;

      if (transform.relativeOffsetX <= edge) {
        actor.remove();
        return false;
      }

      return true;
    });
  }

  private spawnCloud(x: number): void {
    const cloud = this.actorSpawner.spawn(CLOUD_IDS[MathOps.random(0, CLOUD_IDS.length - 1)]);
    const transform = cloud.getComponent(Transform);

    transform.offsetX = x;
    transform.offsetY = MathOps.random(OFFSET_Y_MIN, OFFSET_Y_MAX);

    this.actor.appendChild(cloud);
    this.clouds.push(cloud);
  }

  update(options: UpdateOptions): void {
    this.updateClouds(options.deltaTime);

    this.timeout -= options.deltaTime;

    if (this.timeout > 0) {
      return;
    }

    const cameraActor = this.cameraService.getCurrentCamera();
    const camera = cameraActor.getComponent(Camera);

    this.spawnCloud((camera.windowSizeX / camera.zoom) / 2 + CLOUD_SIZE / 2);

    this.timeout = INTERVAL;
  }
}

CloudsScript.scriptName = 'CloudsScript';
