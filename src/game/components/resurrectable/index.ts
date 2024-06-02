import { Component } from 'remiz';

interface ResurrectableConfig {
  creature: string
  cost: number
  permanent: boolean
}

export class Resurrectable extends Component {
  creature: string;
  cost: number;
  permanent: boolean;

  constructor(config: ResurrectableConfig) {
    super();

    this.creature = config.creature;
    this.cost = config.cost;
    this.permanent = config.permanent;
  }

  clone(): Resurrectable {
    return new Resurrectable({
      creature: this.creature,
      cost: this.cost,
      permanent: this.permanent,
    });
  }
}

Resurrectable.componentName = 'Resurrectable';
