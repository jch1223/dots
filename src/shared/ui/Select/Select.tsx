import React, { type ComponentPropsWithoutRef, useEffect, useId, useRef, useState } from 'react';

import { useOutsideClick } from './hooks/useClickOutside';
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

const NO_HIGHLIGHT = null;

export function Select<T = string | number>({
  value,
  onChange,
  disabled,
  triggerId,
  children,
}: SelectProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedId, setHighlightedId] = useState<string | null>(NO_HIGHLIGHT);
  const defaultTriggerId = useId();
  const listboxId = useId();

  // triggerId prop이 있으면 그것을 사용하고, 없으면 자동 생성된 ID 사용
  const finalTriggerId = triggerId || defaultTriggerId;

  const contextValue: SelectContextValue<T> = {
    isOpen,
    setIsOpen,
    value,
    onChange,
    disabled,
    triggerId: finalTriggerId,
    listboxId,
    highlightedId,
    setHighlightedId,
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
export function SelectTrigger({
  onClick,
  onKeyDown,
  className,
  label,
  ...props
}: Omit<SelectTriggerProps, 'id'>) {
  const { isOpen, setIsOpen, value, disabled, triggerId, listboxId, highlightedId } = useSelect();
  const buttonRef = useRef<HTMLButtonElement>(null);

  // 리스트가 닫힐 때 포커스를 버튼으로 이동
  useEffect(() => {
    if (!isOpen && buttonRef.current) {
      buttonRef.current.focus();
    }
  }, [isOpen]);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;
    setIsOpen(!isOpen);
    onClick?.(event);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (disabled) return;

    switch (e.key) {
      case 'Enter':
      case ' ': // Space
      case 'ArrowDown':
      case 'ArrowUp':
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        }
        break;

      case 'Escape':
        if (isOpen) {
          e.preventDefault();
          setIsOpen(false);
        }
        break;
    }

    onKeyDown?.(e);
  };

  // 표시할 텍스트 결정: value가 있으면 value.label, 없으면 label prop 또는 기본값
  const displayText = value ? value.label : label || '선택하세요';

  return (
    <button
      ref={buttonRef}
      type="button"
      id={triggerId}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      disabled={disabled}
      aria-haspopup="listbox"
      aria-expanded={isOpen}
      aria-controls={listboxId}
      aria-activedescendant={highlightedId || undefined}
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

export function SelectContainer({ children, ...props }: ComponentPropsWithoutRef<'div'>) {
  const { setIsOpen } = useSelect();
  const ref = useOutsideClick(() => setIsOpen(false));

  return (
    <div ref={ref} {...props}>
      {children}
    </div>
  );
}

// SelectList
export function SelectList({ children, ...props }: SelectListProps) {
  const { triggerId, listboxId, highlightedId, setHighlightedId, setIsOpen } = useSelect();
  const listRef = useRef<HTMLUListElement>(null);

  // 리스트가 열릴 때 포커스를 리스트로 이동
  useEffect(() => {
    if (listRef.current) {
      listRef.current.focus();
    }
  }, []);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLUListElement>) => {
    if (!listRef.current) return;

    const options = Array.from(
      listRef.current.querySelectorAll('[role="option"]:not([aria-disabled="true"])'),
    ) as HTMLElement[];

    if (options.length === 0) return;

    const currentIndex = highlightedId ? options.findIndex((opt) => opt.id === highlightedId) : -1;

    switch (event.key) {
      case 'ArrowDown': {
        event.preventDefault();
        const nextIndex = currentIndex + 1;
        if (nextIndex < options.length) {
          setHighlightedId(options[nextIndex].id);
          options[nextIndex].scrollIntoView?.({ block: 'nearest' });
        } else {
          // Loop to start
          setHighlightedId(options[0].id);
          options[0].scrollIntoView?.({ block: 'nearest' });
        }
        break;
      }

      case 'ArrowUp': {
        event.preventDefault();
        const prevIndex = currentIndex - 1;
        if (prevIndex >= 0) {
          setHighlightedId(options[prevIndex].id);
          options[prevIndex].scrollIntoView?.({ block: 'nearest' });
        } else {
          // Loop to end
          setHighlightedId(options[options.length - 1].id);
          options[options.length - 1].scrollIntoView?.({ block: 'nearest' });
        }
        break;
      }

      case 'Home':
        event.preventDefault();
        setHighlightedId(options[0].id);
        options[0].scrollIntoView?.({ block: 'nearest' });
        break;

      case 'End':
        event.preventDefault();
        setHighlightedId(options[options.length - 1].id);
        options[options.length - 1].scrollIntoView?.({ block: 'nearest' });
        break;

      case 'Enter': {
        event.preventDefault();
        if (highlightedId) {
          const highlightedOption = listRef.current.querySelector(
            `[id="${CSS.escape(highlightedId)}"]`,
          ) as HTMLElement;
          if (highlightedOption) {
            highlightedOption.click();
          }
        }
        break;
      }

      case 'Escape':
        setIsOpen(false);
        setHighlightedId(null);
        break;
    }
  };

  return (
    <ul
      ref={listRef}
      role="listbox"
      id={listboxId}
      aria-labelledby={triggerId}
      tabIndex={-1}
      onKeyDown={handleKeyDown}
      {...props}
    >
      {children}
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
export function SelectOption({ option, onClick, disabled, id, ...props }: SelectOptionProps) {
  const { value, onChange, setIsOpen, highlightedId, setHighlightedId } = useSelect();
  const generatedId = useId();
  const optionId = id || generatedId;

  const isOptionDisabled = disabled || option.disabled;

  const handleClick = (event: React.MouseEvent<HTMLLIElement>) => {
    if (isOptionDisabled) {
      event.preventDefault();
      return;
    }

    onChange?.(option);
    setIsOpen(false);
    setHighlightedId(null);
    onClick?.(event);
  };

  const handleMouseEnter = () => {
    if (!isOptionDisabled) {
      setHighlightedId(optionId);
    }
  };

  const isSelected = value !== undefined && compareValue(option.value, value.value);
  const isHighlighted = optionId === highlightedId;

  return (
    <li
      id={optionId}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      data-selected={isSelected}
      data-highlighted={isHighlighted}
      data-disabled={isOptionDisabled ? 'true' : undefined}
      aria-disabled={isOptionDisabled}
      role="option"
      aria-selected={isSelected}
      {...props}
    >
      {option.label}
    </li>
  );
}
