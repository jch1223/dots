import { useEffect } from 'react';
import { createPortal } from 'react-dom';

import { ModalContext } from './model/ModalContext';
import { useFadeAnimation } from './model/useFadeAnimation';
import { useFocusTrap } from './model/useFocusTrap';
import { useModal } from './model/useModal';

import type {
  ModalBackdropProps,
  ModalCloseProps,
  ModalContentProps,
  ModalProps,
} from './model/types';

const DURATION = 500;

export function Modal({
  isOpen,
  onClose,
  children,
  closeOnBackdropClick = true,
  closeOnEsc = true,
}: ModalProps) {
  const { isVisible, shouldRender, duration } = useFadeAnimation({ isOpen, duration: DURATION });
  const { modalRef, handleKeyDown } = useFocusTrap({
    isOpen,
    isVisible,
    shouldRender,
    onClose,
    closeOnEsc,
  });

  // shouldRender가 false면 DOM에서 제거
  if (!shouldRender) {
    return null;
  }

  const contextValue = {
    isOpen,
    onClose,
    closeOnBackdropClick,
    closeOnEsc,
    isVisible,
    duration,
  };

  return createPortal(
    <ModalContext.Provider value={contextValue}>
      <ModalBackdrop isVisible={isVisible} />
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

function ModalBackdrop({ className = '', isVisible }: ModalBackdropProps & { isVisible: boolean }) {
  const { onClose, closeOnBackdropClick = true } = useModal();

  const baseStyles = 'fixed inset-0 bg-black/50 z-40 transition-opacity duration-500';

  const handleClick = () => {
    if (closeOnBackdropClick) {
      onClose();
    }
  };

  return (
    <div
      className={`${baseStyles} ${className} ${isVisible ? 'opacity-100' : 'opacity-0'}`}
      onClick={handleClick}
      aria-hidden="true"
    />
  );
}

export function ModalContent({ children, className = '' }: ModalContentProps) {
  const { isOpen, isVisible = false } = useModal();

  const baseStyles =
    'fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-white rounded-lg shadow-xl p-6 transition-opacity duration-500';

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      // cleanup: 컴포넌트가 언마운트되거나 isOpen이 false가 될 때 항상 복원
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <>
      <div
        className={`${baseStyles} ${className} pointer-events-auto ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
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
