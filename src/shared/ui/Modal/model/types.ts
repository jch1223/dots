import type { ReactNode } from 'react';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
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
}
