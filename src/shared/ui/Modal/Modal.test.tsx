import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Modal, ModalContent } from './Modal';

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

  it('Escape 키를 눌렀을 때 onClose를 호출한다', async () => {
    const user = userEvent.setup();
    const handleClose = vi.fn();

    render(
      <Modal isOpen={true} onClose={handleClose}>
        <ModalContent>
          <div>Modal Content</div>
        </ModalContent>
      </Modal>,
    );

    await user.keyboard('{Escape}');
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('모달 콘텐츠 영역을 클릭했을 때 onClose가 호출되지 않는다', async () => {
    const user = userEvent.setup();
    const handleClose = vi.fn();

    render(
      <Modal isOpen={true} onClose={handleClose}>
        <ModalContent>
          <div>Modal Content</div>
        </ModalContent>
      </Modal>,
    );

    const modalContent = screen.getByRole('dialog');
    await user.click(modalContent);

    // 모달 콘텐츠 클릭 시 stopPropagation으로 이벤트 전파가 막혀 onClose가 호출되지 않아야 함
    expect(handleClose).not.toHaveBeenCalled();
  });

  describe('Focus Trap', () => {
    it('모달이 열릴 때 포커스가 모달 래퍼로 이동한다', () => {
      render(
        <Modal isOpen={true} onClose={() => {}}>
          <ModalContent>
            <input type="text" placeholder="Input 1" />
          </ModalContent>
        </Modal>,
      );

      expect(document.activeElement).toHaveAttribute('tabindex', '-1');
    });

    it('Tab 키를 누르면 포커스가 내부에서 순환한다', async () => {
      const user = userEvent.setup();
      render(
        <Modal isOpen={true} onClose={() => {}}>
          <ModalContent>
            <button>Button 1</button>
            <button>Button 2</button>
            <button>Button 3</button>
          </ModalContent>
        </Modal>,
      );

      const button1 = screen.getByText('Button 1');
      const button2 = screen.getByText('Button 2');
      const button3 = screen.getByText('Button 3');

      await user.tab();
      expect(button1).toHaveFocus();

      await user.tab();
      expect(button2).toHaveFocus();

      await user.tab();
      expect(button3).toHaveFocus();

      // 마지막 요소에서 Tab -> 첫 번째 요소로 이동 (Focus Trap)
      await user.tab();
      expect(button1).toHaveFocus();
    });

    it('Shift+Tab 키를 누르면 포커스가 역방향으로 순환한다', async () => {
      const user = userEvent.setup();
      render(
        <Modal isOpen={true} onClose={() => {}}>
          <ModalContent>
            <button>Button 1</button>
            <button>Button 2</button>
            <button>Button 3</button>
          </ModalContent>
        </Modal>,
      );

      const button1 = screen.getByText('Button 1');
      const button3 = screen.getByText('Button 3');

      // 초기 포커스 설정 (Button 1)
      button1.focus();

      // 첫 번째 요소에서 Shift+Tab -> 마지막 요소로 이동 (Focus Trap)
      await user.keyboard('{Shift>}{Tab}{/Shift}');
      expect(button3).toHaveFocus();
    });
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
