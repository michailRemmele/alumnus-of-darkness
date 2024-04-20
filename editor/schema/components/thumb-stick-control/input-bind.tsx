import { useMemo, useCallback } from 'react';
import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Field,
  LabelledSelect,
  LabelledTextInput,
  MultiField,
  Panel,
  useCommander,
  useExtension,
  commands,
} from 'remiz-editor';

interface EventOption {
  title: string
  value: string
}

interface InputBindProps {
  path: Array<string>
  event: EventOption
  order: number
  availableEvents: Array<EventOption>
}

export const InputBind: FC<InputBindProps> = ({
  path,
  event,
  order,
  availableEvents,
}) => {
  const { t } = useTranslation();
  const { dispatch } = useCommander();
  const { globalReferences } = useExtension();

  const bindPath = useMemo(() => path.concat('inputEventBindings', `event:${event.value}`), [path, event]);
  const eventPath = useMemo(() => bindPath.concat('event'), [bindPath]);
  const eventTypePath = useMemo(() => bindPath.concat('eventType'), [bindPath]);
  const attrsPath = useMemo(() => bindPath.concat('attrs'), [bindPath]);

  const controlEvents = globalReferences.controlEvents?.items;
  const inputEvents = useMemo(() => [event, ...availableEvents], [availableEvents]);

  const handleDeleteBind = useCallback(() => {
    dispatch(commands.deleteValue(bindPath));
  }, [dispatch, bindPath]);

  return (
    <Panel
      className="thumb-stick-control__panel"
      title={t('components.thumbStickControl.bind.title', { index: order + 1 })}
      onDelete={handleDeleteBind}
    >
      <Field
        path={eventPath}
        component={LabelledSelect}
        label={t('components.thumbStickControl.bind.event.title')}
        options={inputEvents}
      />
      <Field
        path={eventTypePath}
        component={controlEvents ? LabelledSelect : LabelledTextInput}
        label={t('components.thumbStickControl.bind.eventType.title')}
        options={controlEvents}
      />
      <span className="thumb-stick-control__title">
        {t('components.thumbStickControl.bind.attributes.title')}
      </span>
      <MultiField
        path={attrsPath}
      />
    </Panel>
  );
};
