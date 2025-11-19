import { useState } from 'react';

import {
  Select,
  SelectLabel,
  SelectList,
  SelectOption,
  SelectPopup,
  SelectTrigger,
} from './Select';

import type { SelectOptionType } from './model/types';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'shared/Select',
  component: Select,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `헤드리스 컴포넌트로 구현하여 유연성을 높였습니다.
디자인시스템이 정해지지 않아 스타일은 상위에서 진행하였습니다.
디자인 시스템이 정의되면 select 컴포넌트 내부에 스타일을 진행합니다.`,
      },
    },
  },
  argTypes: {
    value: {
      control: 'text',
      description: '현재 선택된 값',
    },
    disabled: {
      control: 'boolean',
      description: 'Select 컴포넌트의 disabled 상태',
    },
    placeholder: {
      control: 'text',
      description: '선택된 값이 없을 때 표시할 플레이스홀더 텍스트',
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

const DefaultSelect: Story['render'] = (args) => {
  const typedArgs = args as {
    value?: string | number;
    options: SelectOptionType[];
    disabled?: boolean;
    label?: string;
  };
  const [value, setValue] = useState<string | number | undefined>(typedArgs.value);

  return (
    <div className="w-64">
      <Select
        value={value}
        onChange={setValue}
        options={typedArgs.options}
        disabled={typedArgs.disabled}
      >
        {typedArgs.label && <SelectLabel>{typedArgs.label}</SelectLabel>}
        <div className="relative">
          <SelectTrigger className="flex w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm hover:border-gray-400 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 data-state-open:border-blue-500 data-state-open:ring-2 data-state-open:ring-blue-500" />
          <SelectPopup className="absolute z-10 mt-1 w-full rounded-md border border-gray-300 bg-white shadow-lg">
            <SelectList className="max-h-60 overflow-auto py-1">
              {typedArgs.options.map((option) => (
                <SelectOption
                  key={option.value}
                  option={option}
                  disabled={option.disabled}
                  className="cursor-pointer px-3 py-2 text-sm hover:bg-gray-100 data-disabled:cursor-not-allowed data-disabled:opacity-50 data-[selected=true]:bg-blue-50 data-[selected=true]:text-blue-600"
                />
              ))}
            </SelectList>
          </SelectPopup>
        </div>
      </Select>
    </div>
  );
};

export const Default: Story = {
  render: DefaultSelect,
  args: {
    value: undefined,
    options: [
      { value: 'option1', label: '옵션 1' },
      { value: 'option2', label: '옵션 2' },
      { value: 'option3', label: '옵션 3' },
    ],
  } as Story['args'],
};

export const WithLabel: Story = {
  render: DefaultSelect,
  args: {
    value: undefined,
    options: [
      { value: 'option1', label: '옵션 1' },
      { value: 'option2', label: '옵션 2' },
      { value: 'option3', label: '옵션 3' },
    ],
    label: '선택하세요',
  } as Story['args'],
};

export const Disabled: Story = {
  render: DefaultSelect,
  args: {
    value: undefined,
    options: [
      { value: 'option1', label: '옵션 1' },
      { value: 'option2', label: '옵션 2' },
      { value: 'option3', label: '옵션 3' },
    ],
    disabled: true,
  } as Story['args'],
};

export const WithDisabledOption: Story = {
  render: DefaultSelect,
  args: {
    value: undefined,
    options: [
      { value: 'option1', label: '옵션 1' },
      { value: 'option2', label: '옵션 2', disabled: true },
      { value: 'option3', label: '옵션 3' },
    ],
    disabled: false,
  } as Story['args'],
};
