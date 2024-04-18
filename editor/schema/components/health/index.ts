import type { WidgetSchema } from 'remiz-editor';

export const health: WidgetSchema = {
  title: 'components.health.title',
  fields: [
    {
      name: 'points',
      title: 'components.health.points.title',
      type: 'number',
    },
  ],
  getInitialState: () => ({
    points: 100,
  }),
};
