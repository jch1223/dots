import { useEffect } from 'react';
import { createPortal } from 'react-dom';

import { ModalContext } from './model/ModalContext';

import type { ModalBackdropProps, ModalContentProps, ModalProps } from './model/types';

export function Modal({ isOpen, onClose, children }: ModalProps) {
  if (!isOpen) {
    return null;
  }

  const contextValue = {
    isOpen,
    onClose,
  };

  return createPortal(
    <ModalContext.Provider value={contextValue}>{children}</ModalContext.Provider>,
    document.body,
  );
}

export function ModalBackdrop({ onClick, className = '' }: ModalBackdropProps) {
  const baseStyles = 'fixed inset-0 bg-black/50 z-40';

  return <div className={`${baseStyles} ${className}`} onClick={onClick} aria-hidden="true" />;
}

export function ModalContent({ children, className = '' }: ModalContentProps) {
  const baseStyles =
    'fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-white rounded-lg shadow-xl p-6';

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <div className={`${baseStyles} ${className}`} role="dialog" aria-modal="true">
      {children}
    </div>
  );
}
