import { useEffect, useRef } from 'react';

interface UseFocusTrapProps {
  isOpen: boolean;
  isVisible: boolean;
  shouldRender: boolean;
  onClose: () => void;
  closeOnEsc: boolean;
}

export function useFocusTrap({
  isOpen,
  isVisible,
  shouldRender,
  onClose,
  closeOnEsc,
}: UseFocusTrapProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousActiveElementRef = useRef<HTMLElement | null>(null);

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

  return { modalRef, handleKeyDown };
}
