import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

import { ModalContext } from './model/ModalContext';
import { useModal } from './model/useModal';

import type {
  ModalBackdropProps,
  ModalCloseProps,
  ModalContentProps,
  ModalProps,
} from './model/types';

export function Modal({
  isOpen,
  onClose,
  children,
  closeOnBackdropClick = true,
  closeOnEsc = true,
}: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousActiveElementRef = useRef<HTMLElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  // 모달 열기/닫기 애니메이션 처리
  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
    } else {
      setIsVisible(false);
      // fade out 애니메이션 완료 후 DOM에서 제거
      const timer = setTimeout(() => {
        setShouldRender(false);
      }, 500); // transition duration과 동일하게 설정

      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // DOM이 업데이트된 후 fade in 시작
  // useLayoutEffect는 DOM 업데이트 후, 브라우저가 화면을 그리기 전에 동기적으로 실행됨
  useLayoutEffect(() => {
    if (isOpen && shouldRender) {
      const id = requestAnimationFrame(() => {
        setIsVisible(true);
      });

      return () => cancelAnimationFrame(id);
    }
  }, [isOpen, shouldRender]);

  useEffect(() => {
    if (isOpen && isVisible && shouldRender) {
      // 모달이 열리기 직전의 포커스 요소 저장
      previousActiveElementRef.current = document.activeElement as HTMLElement;

      // 다음 프레임에서 포커스 이동 (DOM이 완전히 렌더링된 후)
      requestAnimationFrame(() => {
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
      });
    } else if (!isOpen && !shouldRender) {
      // 모달이 닫힐 때 이전 포커스 요소로 복원
      if (previousActiveElementRef.current) {
        // 요소가 여전히 DOM에 존재하는지 확인
        if (document.body.contains(previousActiveElementRef.current)) {
          previousActiveElementRef.current.focus();
        }
        previousActiveElementRef.current = null;
      }
    }
  }, [isOpen, isVisible, shouldRender]);

  const handleKeyDown = (event: React.KeyboardEvent) => {
    // isOpen이 true이면 키보드 이벤트 처리 (isVisible과 무관)
    if (event.key === 'Escape' && closeOnEsc && isOpen) {
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
