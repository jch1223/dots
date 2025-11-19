import React, { useId, useState } from 'react';

import { compareValue } from './lib/compareValue';
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
  const { triggerId } = useSelect();

  return (
    <label htmlFor={triggerId} {...props}>
      {children}
    </label>
  );
}

// SelectTrigger
export function SelectTrigger({ onClick, className, id, label, ...props }: SelectTriggerProps) {
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

  // 표시할 텍스트 결정: value가 있으면 value.label, 없으면 label prop 또는 기본값
  const displayText = value ? value.label : label || '선택하세요';

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
    return (
      <ul role="listbox" {...props}>
        {children}
      </ul>
    );
  }

  // children이 없으면 options를 자동으로 렌더링
  return (
    <ul role="listbox" {...props}>
      {options.map((option) => (
        <SelectOption key={String(option.value)} option={option} disabled={option.disabled} />
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
