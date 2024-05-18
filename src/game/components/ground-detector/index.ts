import { Component } from 'remiz';

interface GroundDetectorConfig {
  direction: number
}

export class GroundDetector extends Component {
  direction: number;
  isGround: boolean;

  constructor(config: GroundDetectorConfig) {
    super();

    const { direction } = config;

    this.direction = direction;
    this.isGround = false;
  }

  clone(): GroundDetector {
    return new GroundDetector({
      direction: this.direction,
    });
  }
}

GroundDetector.componentName = 'GroundDetector';
