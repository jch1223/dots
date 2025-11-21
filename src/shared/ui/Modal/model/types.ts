import type { ReactNode } from 'react';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  closeOnBackdropClick?: boolean;
  closeOnEsc?: boolean;
}

export interface ModalBackdropProps {
  onClick?: () => void;
  className?: string;
}

export interface ModalContentProps {
  children: ReactNode;
  className?: string;
}

export interface ModalContextValue {
  isOpen: boolean;
  onClose: () => void;
  closeOnBackdropClick?: boolean;
  closeOnEsc?: boolean;
  isVisible?: boolean;
  duration: number;
}

export interface ModalCloseProps extends React.ComponentPropsWithoutRef<'button'> {
  children: React.ReactNode;
}
