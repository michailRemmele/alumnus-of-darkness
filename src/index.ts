import {
  Engine,

  Animator,
  CameraSystem,
  KeyboardInputSystem,
  KeyboardControlSystem,
  MouseInputSystem,
  MouseControlSystem,
  PhysicsSystem,
  SpriteRenderer,
  ScriptSystem,
  UiBridge,

  Camera,
  KeyboardControl,
  ColliderContainer,
  RigidBody,
  Animatable,
  Sprite,
  Transform,
  MouseControl,
  ScriptBundle,
  Light,
} from 'remiz';

import * as GameSystems from './game/systems';
import * as GameComponents from './game/components';
import * as GameScripts from './game/scripts';

import config from '../data/data.json';

const engine = new Engine({
  config,
  systems: [
    Animator,
    CameraSystem,
    KeyboardInputSystem,
    KeyboardControlSystem,
    MouseInputSystem,
    MouseControlSystem,
    PhysicsSystem,
    SpriteRenderer,
    UiBridge,
    ScriptSystem,
    ...Object.values(GameSystems),
  ],
  components: [
    Camera,
    KeyboardControl,
    ColliderContainer,
    RigidBody,
    Animatable,
    Sprite,
    Transform,
    MouseControl,
    ScriptBundle,
    Light,
    ...Object.values(GameComponents),
  ],
  resources: {
    [ScriptSystem.systemName]: [
      ...Object.values(GameScripts),
    ],
    [UiBridge.systemName]: {
      // comment: to avoid eslint issues with extensions
      // eslint-disable-next-line import/extensions
      loadUiApp: () => import('./ui/index.tsx'),
    },
  },
});

void engine.play();
