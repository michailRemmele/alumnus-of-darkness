import type { WidgetSchema } from 'remiz-editor';

import { ResurrectableWidget } from './view';

export const resurrectable: WidgetSchema = {
  title: 'components.resurrectable.title',
  fields: [
    {
      name: 'creature',
      title: 'components.resurrectable.creature.title',
      type: 'select',
      referenceId: 'creatures',
    },
    {
      name: 'cost',
      title: 'components.resurrectable.cost.title',
      type: 'number',
    },
    {
      name: 'permanent',
      title: 'components.resurrectable.permanent.title',
      type: 'boolean',
    },
  ],
  view: ResurrectableWidget,
  getInitialState: () => ({
    creature: '',
    cost: 0,
    permanent: false,
  }),
};
