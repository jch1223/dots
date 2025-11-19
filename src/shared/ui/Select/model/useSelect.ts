import { useContext } from 'react';
import { createContext } from 'react';

import type { SelectContextValue } from '../Select';

export const SelectContext = createContext<SelectContextValue<unknown> | null>(null);

/**
 * Select 컴포넌트의 컨텍스트에 접근하는 커스텀 훅
 * @throws {Error} Select 컴포넌트 외부에서 사용 시 에러 발생
 */
export function useSelect<T = string | number>(): SelectContextValue<T> {
  const context = useContext(SelectContext);

  if (context === null) {
    throw new Error('useSelect must be used within a Select provider');
  }

  return context as SelectContextValue<T>;
}
