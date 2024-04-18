import { useMemo } from 'react';
import {
  Widget,
  useConfig,
} from 'remiz-editor';

export const WeaponWidget = ({
  fields,
  path,
  references,
}) => {
  const templates = useConfig('templates');

  const extendedReferences = useMemo(() => ({
    ...references,
    models: {
      items: templates.map((template) => ({
        title: template.name,
        value: template.id,
      })),
    },
  }), [references]);

  return (
    <Widget path={path} fields={fields} references={extendedReferences} />
  );
};
