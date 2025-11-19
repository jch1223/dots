import React, { useId, useState } from 'react';

import { SelectContext } from './model/SelectContext';
import { useSelect } from './model/useSelect';

import type {
  SelectContextValue,
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
  const { isOpen, setIsOpen, value, options, disabled, triggerId, setTriggerId } = useSelect();

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

  const selectedOption = options.find((option) => option.value === value);
  const displayText = selectedOption?.label || '선택하세요';

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
  return <ul {...props}>{children}</ul>;
}

// SelectOption
export function SelectOption({ option, onClick, ...props }: SelectOptionProps) {
  const { value, onChange, setIsOpen } = useSelect();

  const handleClick = (event: React.MouseEvent<HTMLLIElement>) => {
    onChange?.(option.value);
    setIsOpen(false);
    onClick?.(event);
  };

  const isSelected = value === option.value;

  return (
    <li onClick={handleClick} data-selected={isSelected} {...props}>
      {option.label}
    </li>
  );
}
