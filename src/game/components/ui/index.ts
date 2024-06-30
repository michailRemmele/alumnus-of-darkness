import { Component } from 'remiz';

interface UIConfig {
  avatarUrl: string
}

export class UI extends Component {
  avatarUrl: string;

  constructor(config: UIConfig) {
    super();

    const { avatarUrl } = config;

    this.avatarUrl = avatarUrl;
  }

  clone(): UI {
    return new UI({ avatarUrl: this.avatarUrl });
  }
}

UI.componentName = 'UI';
