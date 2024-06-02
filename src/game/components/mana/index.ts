import { Component } from 'remiz';

interface ManaConfig {
  points: number
  refillRate: number
}

export class Mana extends Component {
  points: number;
  refillRate: number;
  maxPoints: number;

  constructor(config: ManaConfig) {
    super();

    const { points, refillRate } = config;

    this.points = points;
    this.refillRate = refillRate;
    this.maxPoints = points;
  }

  clone(): Mana {
    return new Mana({ points: this.points, refillRate: this.refillRate });
  }
}

Mana.componentName = 'Mana';
