import type { WidgetSchema } from 'remiz-editor';

export const ui: WidgetSchema = {
  title: 'components.ui.title',
  fields: [
    {
      name: 'avatarUrl',
      title: 'components.ui.avatarUrl.title',
      type: 'string',
    },
  ],
  getInitialState: () => ({
    avatarUrl: '',
  }),
};
