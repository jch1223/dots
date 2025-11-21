import React, { useEffect, useId, useRef, useState } from 'react';

import { compareValue } from './lib/compareValue';
import {
  getFirstEnabledIndex,
  getLastEnabledIndex,
  getNextEnabledIndex,
} from './lib/getNextEnabledIndex';
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
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const defaultTriggerId = useId();
  const listboxId = useId();
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
    listboxId,
    highlightedIndex,
    setHighlightedIndex,
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
  const {
    isOpen,
    setIsOpen,
    value,
    disabled,
    triggerId,
    setTriggerId,
    listboxId,
    options,
    highlightedIndex,
    setHighlightedIndex,
  } = useSelect();
  const buttonRef = useRef<HTMLButtonElement>(null);

  // 실제 사용되는 id 값을 계산
  const actualId = id || triggerId;

  // SelectTrigger에서만 id를 지정할 수 있으므로, 렌더링 시점에 컨텍스트 업데이트
  React.useLayoutEffect(() => {
    if (setTriggerId && actualId) {
      setTriggerId(actualId);
    }
  }, [actualId, setTriggerId]);

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
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
          setHighlightedIndex(getFirstEnabledIndex(options));
        }
        break;

      case 'ArrowDown':
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
          setHighlightedIndex(getFirstEnabledIndex(options));
        } else {
          // 리스트가 이미 열려있으면 하이라이트 이동
          const nextIndex = getNextEnabledIndex(options, highlightedIndex, 'next');
          if (nextIndex !== -1) {
            setHighlightedIndex(nextIndex);
          }
        }
        break;

      case 'ArrowUp':
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
          setHighlightedIndex(getLastEnabledIndex(options));
        } else {
          // 리스트가 이미 열려있으면 하이라이트 이동
          const prevIndex = getNextEnabledIndex(options, highlightedIndex, 'prev');
          if (prevIndex !== -1) {
            setHighlightedIndex(prevIndex);
          }
        }
        break;

      case 'Escape':
        if (isOpen) {
          e.preventDefault();
          setIsOpen(false);
          setHighlightedIndex(-1);
        }
        break;
    }
  };

  // 표시할 텍스트 결정: value가 있으면 value.label, 없으면 label prop 또는 기본값
  const displayText = value ? value.label : label || '선택하세요';

  return (
    <button
      ref={buttonRef}
      type="button"
      id={actualId}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      disabled={disabled}
      aria-haspopup="listbox"
      aria-expanded={isOpen}
      aria-controls={listboxId}
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
  const {
    options,
    triggerId,
    listboxId,
    highlightedIndex,
    setHighlightedIndex,
    onChange,
    setIsOpen,
    isOpen,
  } = useSelect();
  const listRef = useRef<HTMLUListElement>(null);

  // 리스트가 열릴 때 포커스를 리스트로 이동
  useEffect(() => {
    if (isOpen && listRef.current) {
      listRef.current.focus();
    }
  }, [isOpen]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLUListElement>) => {
    switch (event.key) {
      case 'ArrowDown': {
        const nextIndex = getNextEnabledIndex(options, highlightedIndex, 'next');
        if (nextIndex !== -1) {
          setHighlightedIndex(nextIndex);
        }
        break;
      }

      case 'ArrowUp': {
        const prevIndex = getNextEnabledIndex(options, highlightedIndex, 'prev');
        if (prevIndex !== -1) {
          setHighlightedIndex(prevIndex);
        }
        break;
      }

      case 'Home':
        setHighlightedIndex(getFirstEnabledIndex(options));
        break;

      case 'End':
        setHighlightedIndex(getLastEnabledIndex(options));
        break;

      case 'Enter': {
        if (highlightedIndex >= 0) {
          // children이 있을 때는 DOM에서 실제 하이라이트된 옵션을 찾아서 클릭
          if (children && listRef.current) {
            const highlightedOption = listRef.current.querySelector(
              `[role="option"][data-highlighted="true"]`,
            ) as HTMLElement;
            if (highlightedOption && !highlightedOption.hasAttribute('aria-disabled')) {
              highlightedOption.click();
            }
          } else if (highlightedIndex < options.length) {
            // children이 없을 때는 options 배열에서 찾기
            const selectedOption = options[highlightedIndex];
            if (!selectedOption.disabled) {
              onChange?.(selectedOption);
              setIsOpen(false);
              setHighlightedIndex(-1);
            }
          }
        }
        break;
      }

      case 'Escape':
        setIsOpen(false);
        setHighlightedIndex(-1);
        break;
    }
  };

  // children이 있으면 사용자가 직접 렌더링한 것으로 간주
  if (children) {
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

  // children이 없으면 options를 자동으로 렌더링
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
      {options.map((option, index) => (
        <SelectOption
          key={String(option.value)}
          option={option}
          disabled={option.disabled}
          index={index}
        />
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
export function SelectOption({ option, onClick, disabled, index, ...props }: SelectOptionProps) {
  const { value, onChange, setIsOpen, highlightedIndex, setHighlightedIndex } = useSelect();

  const handleClick = (event: React.MouseEvent<HTMLLIElement>) => {
    if (disabled || option.disabled) {
      event.preventDefault();
      return;
    }

    onChange?.(option);
    setIsOpen(false);
    setHighlightedIndex(-1);
    onClick?.(event);
  };

  const handleMouseEnter = () => {
    if (!disabled && !option.disabled && index !== undefined) {
      setHighlightedIndex(index);
    }
  };

  const isSelected = value !== undefined && compareValue(option.value, value.value);
  const isHighlighted = index === highlightedIndex;

  return (
    <li
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      data-selected={isSelected}
      data-highlighted={isHighlighted}
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
