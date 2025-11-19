import { useEffect, useRef } from 'react';

/**
 * 요소 외부 클릭 시 핸들러를 실행하는 ref를 반환하는 커스텀 훅
 * @param handler - 외부 클릭 시 실행할 콜백 함수
 * @returns 요소에 연결할 ref 객체 (이 ref가 연결된 요소 외부를 클릭하면 handler가 실행됨)
 */
export function useOutsideClick<T extends HTMLElement = HTMLDivElement>(handler: () => void) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node;
      if (!ref.current || ref.current.contains(target)) {
        return;
      }
      handler();
    };

    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [handler]);

  return ref;
}
