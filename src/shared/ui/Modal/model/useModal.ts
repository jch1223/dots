import { useContext } from 'react';

import { ModalContext } from './ModalContext';

export function useModal() {
  const context = useContext(ModalContext);

  if (!context) {
    throw new Error('useModal must be used within a Modal component');
  }

  return context;
}
