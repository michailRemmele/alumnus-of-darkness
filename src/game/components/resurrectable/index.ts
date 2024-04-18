import { Component } from 'remiz';

export class Resurrectable extends Component {
  clone(): Resurrectable {
    return new Resurrectable();
  }
}

Resurrectable.componentName = 'Resurrectable';
