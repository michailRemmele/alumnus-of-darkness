import type { FC } from 'react';

import { useCanResurrect } from '../../../../hooks/use-can-resurrect';

import './style.css';

export const ResurrectButton: FC = () => {
  const canResurrect = useCanResurrect();

  if (!canResurrect) {
    return null;
  }

  return (
    <div className="action-button">
      <div className="action-button__key">E</div>
      <div className="action-button__label">Resurrect</div>
    </div>
  );
};
