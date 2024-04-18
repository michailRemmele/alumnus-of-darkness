import type { WidgetSchema } from 'remiz-editor';

export const ai: WidgetSchema = {
  title: 'components.ai.title',
  fields: [
    {
      name: 'strategy',
      title: 'components.ai.strategy.title',
      type: 'select',
      referenceId: 'strategies',
    },
    {
      name: 'isEnemy',
      title: 'components.ai.isEnemy.title',
      type: 'boolean',
    },
  ],
  references: {
    strategies: {
      items: [
        {
          title: 'components.ai.strategies.lightFighter.title',
          value: 'lightFighter',
        },
        {
          title: 'components.ai.strategies.archer.title',
          value: 'archer',
        },
      ],
    },
  },
  getInitialState: () => ({
    strategy: 'lightFighter',
  }),
};
