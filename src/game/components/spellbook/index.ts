import { Component } from 'remiz';

export class Spellbook extends Component {
  canResurrect: boolean;

  constructor() {
    super();

    this.canResurrect = false;
  }

  clone(): Spellbook {
    return new Spellbook();
  }
}

Spellbook.componentName = 'Spellbook';
