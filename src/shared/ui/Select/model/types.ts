import { type ComponentPropsWithoutRef, type ReactNode } from 'react';

export interface SelectOptionType<T = string | number> {
  value: T;
  label: string;
}

export interface SelectContextValue<T = string | number> {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  value?: T;
  onChange?: (value: T) => void;
  options: SelectOptionType<T>[];
  disabled?: boolean;
  triggerId?: string;
  setTriggerId?: (id: string) => void;
}

export interface SelectProps<T = string | number> {
  value?: T;
  onChange?: (value: T) => void;
  options: SelectOptionType<T>[];
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  children: ReactNode;
}

export interface SelectLabelProps extends ComponentPropsWithoutRef<'label'> {
  children: ReactNode;
}

export type SelectTriggerProps = ComponentPropsWithoutRef<'button'>;

export interface SelectPopupProps extends ComponentPropsWithoutRef<'div'> {
  children: ReactNode;
}

export interface SelectListProps extends ComponentPropsWithoutRef<'ul'> {
  children: ReactNode;
}

export interface SelectOptionProps extends ComponentPropsWithoutRef<'li'> {
  option: SelectOptionType;
}
