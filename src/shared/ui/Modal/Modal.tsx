import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

import { ModalContext } from './model/ModalContext';
import { useModal } from './model/useModal';

import type {
  ModalBackdropProps,
  ModalCloseProps,
  ModalContentProps,
  ModalProps,
} from './model/types';

export function Modal({ isOpen, onClose, children }: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      // 모달이 열릴 때 포커스를 모달 래퍼로 이동
      modalRef.current?.focus();
    }
  }, [isOpen]);

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      onClose();
      return;
    }

    if (event.key === 'Tab') {
      const focusableElements = modalRef.current?.querySelectorAll(
        'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])',
      );

      if (!focusableElements || focusableElements.length === 0) {
        event.preventDefault();
        return;
      }

      const firstElement = focusableElements[0] as HTMLElement;
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

      if (event.shiftKey) {
        if (document.activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          event.preventDefault();
          firstElement.focus();
        }
      }
    }
  };

  if (!isOpen) {
    return null;
  }

  const contextValue = {
    isOpen,
    onClose,
  };

  return createPortal(
    <ModalContext.Provider value={contextValue}>
      <ModalBackdrop />
      <div
        ref={modalRef}
        onKeyDown={handleKeyDown}
        tabIndex={-1}
        className="fixed inset-0 z-50 flex items-center justify-center outline-none"
      >
        {children}
      </div>
    </ModalContext.Provider>,
    document.body,
  );
}

function ModalBackdrop({ className = '' }: ModalBackdropProps) {
  const { onClose } = useModal();

  const baseStyles = 'fixed inset-0 bg-black/50 z-40';

  return <div className={`${baseStyles} ${className}`} onClick={onClose} aria-hidden="true" />;
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
    <>
      <div className={`${baseStyles} ${className}`} role="dialog" aria-modal="true">
        {children}
      </div>
    </>
  );
}

export function ModalClose({ className = '', children }: ModalCloseProps) {
  const { onClose } = useModal();

  return (
    <button type="button" onClick={onClose} className={className}>
      {children}
    </button>
  );
}
