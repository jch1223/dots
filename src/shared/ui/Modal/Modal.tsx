import { useEffect } from 'react';
import { createPortal } from 'react-dom';

import { ModalContext } from './model/ModalContext';

import type { ModalBackdropProps, ModalContentProps, ModalProps } from './model/types';

export function Modal({ isOpen, onClose, children }: ModalProps) {
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  const contextValue = {
    isOpen,
    onClose,
  };

  return createPortal(
    <ModalContext.Provider value={contextValue}>
      <div onClick={onClose}>{children}</div>
    </ModalContext.Provider>,
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

  const handleClick = (event: React.MouseEvent) => {
    // 모달 콘텐츠 클릭 시 이벤트 전파를 막아 Backdrop 클릭으로 간주되지 않도록 함
    event.stopPropagation();
  };

  return (
    <div
      className={`${baseStyles} ${className}`}
      role="dialog"
      aria-modal="true"
      onClick={handleClick}
    >
      {children}
    </div>
  );
}
