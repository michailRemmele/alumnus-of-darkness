import type { WidgetSchema } from 'remiz-editor';

export const mana: WidgetSchema = {
  title: 'components.mana.title',
  fields: [
    {
      name: 'points',
      title: 'components.mana.points.title',
      type: 'number',
    },
    {
      name: 'refillRate',
      title: 'components.mana.refillRate.title',
      type: 'number',
    },
  ],
  getInitialState: () => ({
    points: 100,
    refillRate: 10,
  }),
};
