import type { WidgetSchema } from 'remiz-editor';

export const mana: WidgetSchema = {
  title: 'components.mana.title',
  fields: [
    {
      name: 'points',
      title: 'components.mana.points.title',
      type: 'number',
    },
  ],
  getInitialState: () => ({
    points: 100,
  }),
};
