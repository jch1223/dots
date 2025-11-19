/**
 * 값 비교 함수
 * Select 컴포넌트에서 옵션 값과 선택된 값을 비교할 때 사용
 *
 * @param optionValue - 비교할 옵션 값
 * @param targetValue - 비교 대상 값
 * @returns 두 값이 같은지 여부
 */
export function compareValue<T>(optionValue: T, targetValue: T): boolean {
  // null 체크 (typeof null === 'object'이므로 먼저 처리)
  if (optionValue === null || targetValue === null) {
    return optionValue === targetValue;
  }

  // 원시 타입 판별: null을 제외한 모든 non-object 타입 (string, number, boolean, undefined, symbol, function)
  const isOptionPrimitive = typeof optionValue !== 'object';
  const isTargetPrimitive = typeof targetValue !== 'object';

  // 둘 다 원시 타입이면 === 비교
  if (isOptionPrimitive && isTargetPrimitive) {
    return optionValue === targetValue;
  }

  // 하나는 원시 타입이고 하나는 객체면 같을 수 없음
  if (isOptionPrimitive !== isTargetPrimitive) {
    return false;
  }

  // 둘 다 객체면 참조 비교
  return optionValue === targetValue;
}
