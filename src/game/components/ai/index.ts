import { Component } from 'remiz';

export interface AIConfig {
  strategy: string
  isEnemy: boolean
}

export class AI extends Component {
  strategy: string;
  isEnemy: boolean;

  constructor(config: AIConfig) {
    super();

    this.strategy = config.strategy;
    this.isEnemy = config.isEnemy;
  }

  clone(): AI {
    return new AI({
      strategy: this.strategy,
      isEnemy: this.isEnemy,
    });
  }
}

AI.componentName = 'AI';
