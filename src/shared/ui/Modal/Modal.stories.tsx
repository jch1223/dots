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
          Open Modal
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
          <h2 className="mb-4 text-xl font-bold">Modal Title</h2>
          <p className="mb-4 text-gray-600">
            This is a modal dialog. Click the backdrop or the close button to close it.
          </p>
          <ModalClose className="rounded bg-gray-200 px-4 py-2 hover:bg-gray-300">Close</ModalClose>
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
          Open Large Modal
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
          <h2 className="mb-4 text-2xl font-bold">Large Modal</h2>
          <div className="mb-4 text-gray-600">
            <p className="mb-2">
              This is a larger modal with more content. You can customize the size using Tailwind
              classes.
            </p>
            <p className="mb-2">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
              incididunt ut labore et dolore magna aliqua.
            </p>
            <p>
              Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex
              ea commodo consequat.
            </p>
          </div>
          <div className="flex justify-end gap-2">
            <ModalClose className="rounded bg-gray-200 px-4 py-2 hover:bg-gray-300">
              close
            </ModalClose>
            <ModalClose className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600">
              Confirm
            </ModalClose>
          </div>
        </ModalContent>
      </>
    ),
  },
};
