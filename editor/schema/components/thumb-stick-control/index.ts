import type { WidgetSchema } from 'remiz-editor';

import { ThumbStickControlWidget } from './view';

export const thumbStickControl: WidgetSchema = {
  title: 'components.thumbStickControl.title',
  view: ThumbStickControlWidget,
  getInitialState: () => ({
    inputEventBindings: [],
  }),
};
