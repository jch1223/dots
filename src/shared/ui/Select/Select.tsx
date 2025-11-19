import React, { useId, useState } from 'react';

import { SelectContext } from './model/SelectContext';
import { useSelect } from './model/useSelect';

import type {
  SelectContextValue,
  SelectGroupProps,
  SelectLabelProps,
  SelectListProps,
  SelectOptionProps,
  SelectPopupProps,
  SelectProps,
  SelectTriggerProps,
} from './model/types';

export function Select<T = string | number>({
  value,
  onChange,
  options,
  disabled,
  children,
}: SelectProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const defaultTriggerId = useId();
  const [actualTriggerId, setActualTriggerId] = useState<string>(defaultTriggerId);

  const contextValue: SelectContextValue<T> = {
    isOpen,
    setIsOpen,
    value,
    onChange,
    options,
    disabled,
    triggerId: actualTriggerId,
    setTriggerId: setActualTriggerId,
  };

  return (
    <SelectContext.Provider value={contextValue as SelectContextValue<unknown>}>
      {children}
    </SelectContext.Provider>
  );
}

// SelectLabel
export function SelectLabel({ children, ...props }: SelectLabelProps) {
  const { disabled, triggerId } = useSelect();

  const handleClick = (event: React.MouseEvent<HTMLLabelElement>) => {
    // htmlFor로 연결된 button의 클릭 이벤트가 자동으로 발생하지만,
    // disabled 상태일 때는 이벤트가 발생하지 않으므로 명시적으로 처리
    if (disabled) {
      event.preventDefault();
      return;
    }
  };

  return (
    <label htmlFor={triggerId} onClick={handleClick} {...props}>
      {children}
    </label>
  );
}

// SelectTrigger
export function SelectTrigger({ onClick, className, id, ...props }: SelectTriggerProps) {
  const { isOpen, setIsOpen, value, disabled, triggerId, setTriggerId } = useSelect();

  // 실제 사용되는 id 값을 계산
  const actualId = id || triggerId;

  // SelectTrigger에서만 id를 지정할 수 있으므로, 렌더링 시점에 컨텍스트 업데이트
  React.useLayoutEffect(() => {
    if (setTriggerId && actualId) {
      setTriggerId(actualId);
    }
  }, [actualId, setTriggerId]);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;
    setIsOpen(!isOpen);
    onClick?.(event);
  };

  const displayText = value ? value.label : '선택하세요';

  return (
    <button
      type="button"
      id={actualId}
      onClick={handleClick}
      disabled={disabled}
      data-state={isOpen ? 'open' : 'closed'}
      data-disabled={disabled ? 'true' : undefined}
      aria-disabled={disabled}
      className={className}
      {...props}
    >
      <span>{displayText}</span>
      <span className="ml-2" aria-hidden="true">
        {isOpen ? '▲' : '▼'}
      </span>
    </button>
  );
}

// SelectPopup
export function SelectPopup({ children, ...props }: SelectPopupProps) {
  const { isOpen } = useSelect();

  if (!isOpen) {
    return null;
  }

  return <div {...props}>{children}</div>;
}

// SelectList
export function SelectList({ children, ...props }: SelectListProps) {
  const { options } = useSelect();

  // children이 있으면 사용자가 직접 렌더링한 것으로 간주
  if (children) {
    return <ul {...props}>{children}</ul>;
  }

  // children이 없으면 options를 자동으로 렌더링
  return (
    <ul {...props}>
      {options.map((option) => (
        <SelectOption key={option.value} option={option} disabled={option.disabled} />
      ))}
    </ul>
  );
}

// SelectGroup
export function SelectGroup({ label, children, className, ...props }: SelectGroupProps) {
  return (
    <li role="group" aria-label={label} className={className} {...props}>
      <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase">{label}</div>
      <ul>{children}</ul>
    </li>
  );
}

// SelectOption
export function SelectOption({ option, onClick, disabled, ...props }: SelectOptionProps) {
  const { value, onChange, setIsOpen } = useSelect();

  const handleClick = (event: React.MouseEvent<HTMLLIElement>) => {
    if (disabled || option.disabled) {
      event.preventDefault();
      return;
    }

    onChange?.(option);
    setIsOpen(false);
    onClick?.(event);
  };

  // 비교 함수: value가 SelectOptionType이므로 value.value와 비교
  const compareValue = <T,>(optionValue: T, targetValue: T): boolean => {
    // null 체크 (typeof null === 'object'이므로 먼저 처리)
    if (optionValue === null || targetValue === null) {
      return optionValue === targetValue;
    }

    // 둘 다 원시 타입이면 === 비교
    const isOptionPrimitive = typeof optionValue !== 'object';
    const isTargetPrimitive = typeof targetValue !== 'object';

    if (isOptionPrimitive && isTargetPrimitive) {
      return optionValue === targetValue;
    }

    // 하나는 원시 타입이고 하나는 객체면 같을 수 없음
    if (isOptionPrimitive !== isTargetPrimitive) {
      return false;
    }

    // 둘 다 객체면 참조 비교
    return optionValue === targetValue;
  };

  const isSelected = value !== undefined && compareValue(option.value, value.value);

  return (
    <li
      onClick={handleClick}
      data-selected={isSelected}
      data-disabled={disabled || option.disabled ? 'true' : undefined}
      aria-disabled={disabled || option.disabled}
      role="option"
      aria-selected={isSelected}
      {...props}
    >
      {option.label}
    </li>
  );
}
