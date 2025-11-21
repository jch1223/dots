import type { SelectOptionType } from '../model/types';

/**
 * 비활성화된 옵션을 건너뛰고 다음/이전 활성화된 옵션의 인덱스를 찾습니다.
 * @param options - 전체 옵션 배열
 * @param currentIndex - 현재 인덱스
 * @param direction - 이동 방향 ('next' | 'prev')
 * @returns 다음 활성화된 옵션의 인덱스, 없으면 -1
 */
export function getNextEnabledIndex(
  options: SelectOptionType[],
  currentIndex: number,
  direction: 'next' | 'prev',
): number {
  const step = direction === 'next' ? 1 : -1;
  let index = currentIndex + step;

  // 순환하면서 활성화된 옵션 찾기
  while (index >= 0 && index < options.length) {
    if (!options[index].disabled) {
      return index;
    }
    index += step;
  }

  return -1;
}

/**
 * 첫 번째 활성화된 옵션의 인덱스를 찾습니다.
 */
export function getFirstEnabledIndex(options: SelectOptionType[]): number {
  return options.findIndex((option) => !option.disabled);
}

/**
 * 마지막 활성화된 옵션의 인덱스를 찾습니다.
 */
export function getLastEnabledIndex(options: SelectOptionType[]): number {
  for (let i = options.length - 1; i >= 0; i--) {
    if (!options[i].disabled) {
      return i;
    }
  }
  return -1;
}
