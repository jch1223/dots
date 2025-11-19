import React, { useState } from 'react';

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

  const contextValue: SelectContextValue<T> = {
    isOpen,
    setIsOpen,
    value,
    onChange,
    options,
    disabled,
  };

  return (
    <SelectContext.Provider value={contextValue as SelectContextValue<unknown>}>
      {children}
    </SelectContext.Provider>
  );
}

// SelectLabel
export function SelectLabel({ children, ...props }: SelectLabelProps) {
  return <label {...props}>{children}</label>;
}

// SelectTrigger
export function SelectTrigger({ onClick, className, ...props }: SelectTriggerProps) {
  const { isOpen, setIsOpen, value, options, disabled } = useSelect();

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
