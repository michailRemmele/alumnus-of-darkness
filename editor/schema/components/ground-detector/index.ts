import type { WidgetSchema } from 'remiz-editor';

export const groundDetector: WidgetSchema = {
  title: 'components.groundDetector.title',
  fields: [
    {
      name: 'direction',
      title: 'components.groundDetector.direction.title',
      type: 'number',
    },
  ],
  getInitialState: () => ({
    direction: 0,
  }),
};
