import { useMemo, useCallback } from 'react';
import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from 'antd';
import { useConfig, useCommander, commands } from 'remiz-editor';
import type { WidgetProps } from 'remiz-editor';

import type { EventOption, InputEventBind } from './types';
import { InputBind } from './input-bind';
import './style.css';

const events = [
  {
    title: 'components.thumbStickControl.option.positionChange.title',
    value: 'ThumbStickInput',
  },
];

export const ThumbStickControlWidget: FC<WidgetProps> = ({ path }) => {
  const { t } = useTranslation();
  const { dispatch } = useCommander();

  const bindingsPath = useMemo(() => path.concat('inputEventBindings'), [path]);

  const inputEventBindings = useConfig(bindingsPath) as Array<InputEventBind>;

  const options = useMemo(() => events.map(({ title, value }) => ({
    title: t(title),
    value,
  })), []);
  const optionsMap = useMemo(() => options.reduce((acc, option) => {
    acc[option.value] = option;
    return acc;
  }, {} as Record<string, EventOption>), [options]);
  const bindingsMap = useMemo(
    () => inputEventBindings.reduce((acc, { event, ...bind }) => {
      acc[event] = bind;
      return acc;
    }, {} as Record<string, Record<string, unknown>>),
    [inputEventBindings],
  );
  const availableOptions = useMemo(
    () => options.filter((event) => !bindingsMap[event.value]),
    [options, bindingsMap],
  );
  const addedOptions = useMemo(
    () => inputEventBindings.map((bind) => optionsMap[bind.event]),
    [inputEventBindings, optionsMap],
  );

  const handleAddNewBind = useCallback(() => {
    const inputEvent = availableOptions[0].value;
    dispatch(commands.addValue(bindingsPath, { event: inputEvent, eventType: '', attrs: [] }));
  }, [dispatch, bindingsPath, availableOptions]);

  return (
    <div>
      <ul className="thumb-stick-control__list">
        {addedOptions.map((event, index) => (
          <li key={event.value}>
            <InputBind
              path={path}
              event={event}
              order={index}
              availableEvents={availableOptions}
            />
          </li>
        ))}
      </ul>
      <Button
        className="thumb-stick-control__button"
        size="small"
        onClick={handleAddNewBind}
        disabled={availableOptions.length === 0}
      >
        {t('components.thumbStickControl.bind.addNew.title')}
      </Button>
    </div>
  );
};
