import { Component } from 'remiz';

interface ManaConfig {
  points: number
}

export class Mana extends Component {
  points: number;
  maxPoints: number;

  constructor(config: ManaConfig) {
    super();

    const { points } = config;

    this.points = points;
    this.maxPoints = points;
  }

  clone(): Mana {
    return new Mana({ points: this.points });
  }
}

Mana.componentName = 'Mana';
