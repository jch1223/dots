import { type ComponentPropsWithoutRef, type ReactNode } from 'react';

// 개별 옵션 타입
export interface SelectOptionType<T = string | number> {
  value: T;
  label: string;
  disabled?: boolean;
}

export interface SelectContextValue<T = string | number> {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  value?: SelectOptionType<T>;
  onChange?: (option: SelectOptionType<T>) => void;
  options: SelectOptionType<T>[];
  disabled?: boolean;
  triggerId?: string;
  setTriggerId?: (id: string) => void;
}

export interface SelectProps<T = string | number> {
  value?: SelectOptionType<T>;
  onChange?: (option: SelectOptionType<T>) => void;
  options: SelectOptionType<T>[];
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  children: ReactNode;
}

export interface SelectLabelProps extends ComponentPropsWithoutRef<'label'> {
  children: ReactNode;
}

export interface SelectTriggerProps extends ComponentPropsWithoutRef<'button'> {
  label?: string;
}

export interface SelectPopupProps extends ComponentPropsWithoutRef<'div'> {
  children: ReactNode;
}

export interface SelectListProps extends ComponentPropsWithoutRef<'ul'> {
  children?: ReactNode;
}
export interface SelectOptionProps<T = string | number> extends ComponentPropsWithoutRef<'li'> {
  option: SelectOptionType<T>;
  disabled?: boolean;
}
export interface SelectGroupProps extends ComponentPropsWithoutRef<'li'> {
  label: string;
  children: ReactNode;
}
