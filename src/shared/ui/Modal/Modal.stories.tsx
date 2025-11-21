import { useState } from 'react';

import { Modal, ModalClose, ModalContent } from './Modal';

import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'shared/Modal',
  component: Modal,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    children: {
      description: 'Modal 내부 콘텐츠 (ModalContent, ModalClose)',
    },
  },
} satisfies Meta<typeof Modal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <>
        <button
          onClick={() => setIsOpen(true)}
          className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
        >
          모달 열기
        </button>

        <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
          {args.children}
        </Modal>
      </>
    );
  },
  args: {
    isOpen: false,
    onClose: () => {},
    children: (
      <>
        <ModalContent>
          <h2 className="mb-4 text-xl font-bold">모달 제목</h2>
          <p className="mb-4 text-gray-600">
            이것은 모달 대화상자입니다. 배경을 클릭하거나 닫기 버튼을 눌러 닫을 수 있습니다.
          </p>
          <ModalClose className="rounded bg-gray-200 px-4 py-2 hover:bg-gray-300">닫기</ModalClose>
        </ModalContent>
      </>
    ),
  },
};

export const LargeModal: Story = {
  render: (args) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <>
        <button
          onClick={() => setIsOpen(true)}
          className="rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600"
        >
          큰 모달 열기
        </button>

        <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
          {args.children}
        </Modal>
      </>
    );
  },
  args: {
    isOpen: false,
    onClose: () => {},
    children: (
      <>
        <ModalContent className="max-w-2xl">
          <h2 className="mb-4 text-2xl font-bold">큰 모달</h2>
          <div className="mb-4 text-gray-600">
            <p className="mb-2">
              더 많은 콘텐츠가 있는 큰 모달입니다. Tailwind 클래스를 사용하여 크기를 사용자 정의할
              수 있습니다.
            </p>
            <p className="mb-2">
              이것은 더 많은 정보를 표시할 수 있는 큰 모달의 예시입니다. 다양한 크기와 스타일을
              적용하여 사용자 경험을 개선할 수 있습니다.
            </p>
            <p>
              모달은 사용자에게 중요한 정보를 전달하거나 확인을 요청할 때 유용한 UI 컴포넌트입니다.
            </p>
          </div>
          <div className="flex justify-end gap-2">
            <ModalClose className="rounded bg-gray-200 px-4 py-2 hover:bg-gray-300">
              닫기
            </ModalClose>
            <ModalClose className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600">
              확인
            </ModalClose>
          </div>
        </ModalContent>
      </>
    ),
  },
};

export const CustomCloseOptions: Story = {
  render: (args) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <>
        <button
          onClick={() => setIsOpen(true)}
          className="rounded bg-orange-500 px-4 py-2 text-white hover:bg-orange-600"
        >
          커스텀 옵션 모달 열기
        </button>

        <Modal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          closeOnBackdropClick={args.closeOnBackdropClick}
          closeOnEsc={args.closeOnEsc}
        >
          {args.children}
        </Modal>
      </>
    );
  },
  args: {
    isOpen: false,
    onClose: () => {},
    closeOnBackdropClick: false,
    closeOnEsc: false,
    children: (
      <>
        <ModalContent>
          <h2 className="mb-4 text-xl font-bold">커스텀 닫기 옵션</h2>
          <p className="mb-4 text-gray-600">
            이 모달은 커스텀 닫기 옵션이 있습니다. 배경 클릭과 Escape 키가 비활성화되어 있습니다.
            닫기 버튼을 사용해서만 닫을 수 있습니다.
          </p>
          <ModalClose className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600">
            닫기
          </ModalClose>
        </ModalContent>
      </>
    ),
  },
  argTypes: {
    closeOnBackdropClick: {
      control: 'boolean',
      description: '배경을 클릭했을 때 모달이 닫히는지 여부',
    },
    closeOnEsc: {
      control: 'boolean',
      description: 'Escape 키를 눌렀을 때 모달이 닫히는지 여부',
    },
  },
};
