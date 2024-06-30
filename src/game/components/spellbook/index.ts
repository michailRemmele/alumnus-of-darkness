import { Component } from 'remiz';
import type { Actor } from 'remiz';

export class Spellbook extends Component {
  canResurrect: boolean;
  activeMinions: Array<Actor>;
  selectedGhost: string;

  constructor() {
    super();

    this.canResurrect = false;
    this.activeMinions = [];
    this.selectedGhost = '';
  }

  clone(): Spellbook {
    return new Spellbook();
  }
}

Spellbook.componentName = 'Spellbook';
