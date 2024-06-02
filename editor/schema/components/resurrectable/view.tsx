import { useMemo } from 'react';
import type { FC } from 'react';
import {
  Widget,
  useConfig,
} from 'remiz-editor';
import type { WidgetProps } from 'remiz-editor';
import type { TemplateConfig } from 'remiz';

import { Ghost } from '../../../../src/game/components';

export const ResurrectableWidget: FC<WidgetProps> = ({
  fields,
  path,
  references,
}) => {
  const templates = useConfig('templates') as Array<TemplateConfig>;

  const extendedReferences = useMemo(() => ({
    ...references,
    creatures: {
      items: templates
        .filter((template) => template.components?.find(
          (component) => component.name === Ghost.componentName,
        ))
        .map((template) => ({
          title: template.name,
          value: template.id,
        })),
    },
  }), [references]);

  return (
    <Widget path={path} fields={fields} references={extendedReferences} />
  );
};
