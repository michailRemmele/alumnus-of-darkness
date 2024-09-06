import type { WidgetPartSchema } from 'remiz-editor';

export const healEffect: WidgetPartSchema = {
  fields: [
    {
      name: 'value',
      title: 'resources.effectsSystem.heal.value.title',
      type: 'number',
    },
  ],
  getInitialState: () => ({
    value: 0,
  }),
};
