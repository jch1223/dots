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
  const previousActiveElementRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      // 모달이 열리기 직전의 포커스 요소 저장
      previousActiveElementRef.current = document.activeElement as HTMLElement;

      // 모달 내부의 첫 번째 포커스 가능한 요소 찾기
      const focusableElements = modalRef.current?.querySelectorAll(
        'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])',
      );

      if (focusableElements && focusableElements.length > 0) {
        // 첫 번째 포커스 가능한 요소로 포커스 이동
        (focusableElements[0] as HTMLElement).focus();
      } else {
        // 포커스 가능한 요소가 없으면 래퍼로 포커스 이동
        modalRef.current?.focus();
      }
    } else {
      // 모달이 닫힐 때 이전 포커스 요소로 복원
      if (previousActiveElementRef.current) {
        // 요소가 여전히 DOM에 존재하는지 확인
        if (document.body.contains(previousActiveElementRef.current)) {
          previousActiveElementRef.current.focus();
        }
        previousActiveElementRef.current = null;
      }
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
        className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center outline-none"
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
      <div
        className={`${baseStyles} ${className} pointer-events-auto`}
        role="dialog"
        aria-modal="true"
      >
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
