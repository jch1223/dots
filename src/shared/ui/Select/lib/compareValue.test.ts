import { describe, expect, it } from 'vitest';

import { compareValue } from './compareValue';

describe('compareValue', () => {
  describe('원시 타입 비교', () => {
    it('같은 string 값을 비교하면 true를 반환해야 함', () => {
      expect(compareValue('hello', 'hello')).toBe(true);
      expect(compareValue('', '')).toBe(true);
    });

    it('다른 string 값을 비교하면 false를 반환해야 함', () => {
      expect(compareValue('hello', 'world')).toBe(false);
      expect(compareValue('a', 'b')).toBe(false);
    });

    it('같은 number 값을 비교하면 true를 반환해야 함', () => {
      expect(compareValue(1, 1)).toBe(true);
      expect(compareValue(0, 0)).toBe(true);
      expect(compareValue(-1, -1)).toBe(true);
      expect(compareValue(3.14, 3.14)).toBe(true);
    });

    it('다른 number 값을 비교하면 false를 반환해야 함', () => {
      expect(compareValue(1, 2)).toBe(false);
      expect(compareValue(0, 1)).toBe(false);
      expect(compareValue(3.14, 3.15)).toBe(false);
    });

    it('같은 boolean 값을 비교하면 true를 반환해야 함', () => {
      expect(compareValue(true, true)).toBe(true);
      expect(compareValue(false, false)).toBe(true);
    });

    it('다른 boolean 값을 비교하면 false를 반환해야 함', () => {
      expect(compareValue(true, false)).toBe(false);
      expect(compareValue(false, true)).toBe(false);
    });
  });

  describe('null 및 undefined 처리', () => {
    it('둘 다 null이면 true를 반환해야 함', () => {
      expect(compareValue(null, null)).toBe(true);
    });

    it('하나만 null이면 false를 반환해야 함', () => {
      expect(compareValue(null, 'value')).toBe(false);
      expect(compareValue('value', null)).toBe(false);
      expect(compareValue(null, 0)).toBe(false);
      expect(compareValue(0, null)).toBe(false);
    });

    it('undefined는 원시 타입으로 처리되어야 함', () => {
      expect(compareValue(undefined, undefined)).toBe(true);
      expect(compareValue(undefined, null)).toBe(false);
      expect(compareValue(null, undefined)).toBe(false);
    });
  });

  describe('객체 비교', () => {
    it('같은 객체 참조를 비교하면 true를 반환해야 함', () => {
      const obj = { a: 1 };
      expect(compareValue(obj, obj)).toBe(true);
    });

    it('다른 객체 참조를 비교하면 false를 반환해야 함 (내용이 같아도)', () => {
      const obj1 = { a: 1 };
      const obj2 = { a: 1 };
      expect(compareValue(obj1, obj2)).toBe(false);
    });

    it('배열도 참조 비교를 해야 함', () => {
      const arr1 = [1, 2, 3];
      const arr2 = [1, 2, 3];
      expect(compareValue(arr1, arr1)).toBe(true);
      expect(compareValue(arr1, arr2)).toBe(false);
    });
  });

  describe('타입이 다른 경우', () => {
    it('원시 타입과 객체를 비교하면 false를 반환해야 함', () => {
      expect(compareValue('string', {} as unknown as string)).toBe(false);
      expect(compareValue({} as unknown as string, 'string')).toBe(false);
      expect(compareValue(1, {} as unknown as number)).toBe(false);
      expect(compareValue({} as unknown as number, 1)).toBe(false);
      expect(compareValue(true, {} as unknown as boolean)).toBe(false);
      expect(compareValue({} as unknown as boolean, true)).toBe(false);
    });

    it('다른 원시 타입을 비교하면 false를 반환해야 함', () => {
      expect(compareValue('1', 1 as unknown as string)).toBe(false);
      expect(compareValue(1, '1' as unknown as number)).toBe(false);
      expect(compareValue('true', true as unknown as string)).toBe(false);
      expect(compareValue(true, 'true' as unknown as boolean)).toBe(false);
    });
  });

  describe('엣지 케이스', () => {
    it('symbol은 원시 타입으로 처리되어야 함', () => {
      const sym1: symbol = Symbol('test');
      const sym2: symbol = Symbol('test');
      expect(compareValue(sym1, sym1)).toBe(true);
      expect(compareValue(sym1, sym2)).toBe(false);
    });

    it('function은 원시 타입으로 처리되어야 함', () => {
      const fn1: () => void = () => {};
      const fn2: () => void = () => {};
      expect(compareValue(fn1, fn1)).toBe(true);
      expect(compareValue(fn1, fn2)).toBe(false);
    });

    it('빈 객체와 빈 배열은 다른 타입으로 처리되어야 함', () => {
      expect(compareValue({}, [])).toBe(false);
      expect(compareValue([], {})).toBe(false);
    });

    it('NaN은 원시 타입으로 처리되어야 함', () => {
      // NaN은 자기 자신과도 같지 않음 (IEEE 754 표준)
      expect(compareValue(NaN, NaN)).toBe(false);
      expect(compareValue(NaN, 1)).toBe(false);
    });
  });

  describe('실제 사용 시나리오 (Select 컴포넌트)', () => {
    it('string 옵션 값 비교', () => {
      expect(compareValue('option1', 'option1')).toBe(true);
      expect(compareValue('option1', 'option2')).toBe(false);
    });

    it('number 옵션 값 비교', () => {
      expect(compareValue(1, 1)).toBe(true);
      expect(compareValue(1, 2)).toBe(false);
    });

    it('객체 옵션 값 비교 (참조 비교)', () => {
      const option1 = { id: 1, name: 'Option 1' };
      const option2 = { id: 1, name: 'Option 1' };
      expect(compareValue(option1, option1)).toBe(true);
      expect(compareValue(option1, option2)).toBe(false);
    });
  });
});
