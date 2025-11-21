import { useEffect, useLayoutEffect, useState } from 'react';

export function useFadeAnimation({ isOpen, duration }: { isOpen: boolean; duration: number }) {
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
      }, duration); // transition duration과 동일하게 설정

      return () => clearTimeout(timer);
    }
  }, [isOpen, duration]);

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

  return { isVisible, shouldRender, duration };
}
