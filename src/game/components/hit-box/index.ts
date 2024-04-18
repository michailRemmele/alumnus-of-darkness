import { Component } from 'remiz';

export class HitBox extends Component {
  clone(): HitBox {
    return new HitBox();
  }
}

HitBox.componentName = 'HitBox';
