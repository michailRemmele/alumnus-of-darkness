import { Component } from 'remiz';

export type AttributeValue = string | number | boolean | Array<string>;

export type InputEventAttributes = Record<string, AttributeValue>;

export interface InputEventAttributeConfig {
  name: string
  value: AttributeValue
}

export interface ThumbStickEventBind {
  eventType: string
  attrs: InputEventAttributes
}

export interface InputEventBindings {
  [key: string]: ThumbStickEventBind
}

export interface ThumbStickEventBindConfig {
  event: string
  eventType: string
  attrs: Array<InputEventAttributeConfig>
}

interface ThumbStickControlConfig {
  inputEventBindings: Array<ThumbStickEventBindConfig>
}

export class ThumbStickControl extends Component {
  inputEventBindings: InputEventBindings;

  constructor(config: ThumbStickControlConfig) {
    super();

    const { inputEventBindings } = config;

    this.inputEventBindings = inputEventBindings.reduce((acc: InputEventBindings, bind) => {
      acc[bind.event] = {
        eventType: bind.eventType,
        attrs: bind.attrs.reduce((attrs: InputEventAttributes, attr) => {
          attrs[attr.name] = attr.value;
          return attrs;
        }, {}),
      };
      return acc;
    }, {});
  }

  clone(): ThumbStickControl {
    return new ThumbStickControl({
      inputEventBindings: Object.keys(this.inputEventBindings).map(
        (key) => ({
          event: key,
          eventType: this.inputEventBindings[key].eventType,
          attrs: Object.keys(this.inputEventBindings[key].attrs).map(
            (name) => ({ name, value: this.inputEventBindings[key].attrs[name] }),
          ),
        }),
      ),
    });
  }
}

ThumbStickControl.componentName = 'ThumbStickControl';
