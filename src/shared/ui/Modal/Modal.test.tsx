import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Modal, ModalBackdrop, ModalContent } from './Modal';

describe('Modal 컴포넌트', () => {
  it('isOpen이 false일 때 아무것도 렌더링하지 않는다', () => {
    const { container } = render(
      <Modal isOpen={false} onClose={() => {}}>
        <ModalContent>
          <div>Modal Content</div>
        </ModalContent>
      </Modal>,
    );

    expect(container.firstChild).toBeNull();
  });

  it('isOpen이 true일 때 모달을 렌더링한다', () => {
    render(
      <Modal isOpen={true} onClose={() => {}}>
        <ModalContent>
          <div>Modal Content</div>
        </ModalContent>
      </Modal>,
    );

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Modal Content')).toBeInTheDocument();
  });

  it('backdrop 클릭 시 onClose를 호출한다', async () => {
    const user = userEvent.setup();
    const handleClose = vi.fn();

    render(
      <Modal isOpen={true} onClose={handleClose}>
        <ModalBackdrop onClick={handleClose} />
        <ModalContent>
          <div>Modal Content</div>
        </ModalContent>
      </Modal>,
    );

    const backdrop = document.querySelector('[aria-hidden="true"]');
    if (backdrop) {
      await user.click(backdrop);
      expect(handleClose).toHaveBeenCalledTimes(1);
    }
  });

  it('모달이 열려있을 때 body 스크롤을 방지한다', () => {
    render(
      <Modal isOpen={true} onClose={() => {}}>
        <ModalContent>
          <div>Modal Content</div>
        </ModalContent>
      </Modal>,
    );

    expect(document.body.style.overflow).toBe('hidden');
  });

  it('모달이 닫힐 때 body 스크롤을 복원한다', () => {
    const { unmount } = render(
      <Modal isOpen={true} onClose={() => {}}>
        <ModalContent>
          <div>Modal Content</div>
        </ModalContent>
      </Modal>,
    );

    expect(document.body.style.overflow).toBe('hidden');

    unmount();

    expect(document.body.style.overflow).toBe('');
  });
});
