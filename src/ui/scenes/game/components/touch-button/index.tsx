import {
  useCallback, useState,
} from 'react';
import type { FC } from 'react';

import './style.css';

const SIZES = {
  l: 'touch-button_large',
  m: '',
};

interface TouchButtonProps {
  title: string
  onClick: (event: React.PointerEvent) => void
  size?: 'm' | 'l'
  disabled?: boolean
}

export const TouchButton: FC<TouchButtonProps> = ({
  title,
  onClick,
  size = 'm',
  disabled,
}) => {
  const [active, setActive] = useState(false);

  const handlePointerUp = useCallback(() => {
    setActive(false);
  }, [onClick]);

  const handlePointerDown = useCallback((event: React.PointerEvent) => {
    onClick(event);
    setActive(true);
  }, []);

  return (
    <button
      type="button"
      className={`touch-button ${active ? 'touch-button_active' : ''} ${disabled ? 'touch-button_disabled' : ''} ${SIZES[size]}`}
      onPointerUp={handlePointerUp}
      onPointerDown={handlePointerDown}
      disabled={disabled}
    >
      {title}
    </button>
  );
};
