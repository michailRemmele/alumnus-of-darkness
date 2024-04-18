import { Component } from 'remiz';

export class Ghost extends Component {
  clone(): Ghost {
    return new Ghost();
  }
}

Ghost.componentName = 'Ghost';
