import { useState } from 'react';
import { expect, userEvent, within } from 'storybook/test';

import {
  Select,
  SelectGroup,
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
    value?: SelectOptionType;
    options: SelectOptionType[];
    disabled?: boolean;
    label?: string;
  };
  const [value, setValue] = useState<SelectOptionType | undefined>(typedArgs.value);

  return (
    <div className="w-64">
      <Select
        value={value}
        onChange={(option) => setValue(option)}
        options={typedArgs.options}
        disabled={typedArgs.disabled}
      >
        <div className="relative">
          <SelectTrigger
            label={typedArgs.label}
            className="flex w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm hover:border-gray-400 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 data-state-open:border-blue-500 data-state-open:ring-2 data-state-open:ring-blue-500"
          />
          <SelectPopup className="absolute z-10 mt-1 w-full rounded-md border border-gray-300 bg-white shadow-lg">
            <SelectList className="max-h-60 overflow-auto py-1">
              {typedArgs.options.map((option, index) => (
                <SelectOption
                  key={option.value}
                  option={option}
                  disabled={option.disabled}
                  index={index}
                  className="cursor-pointer px-3 py-2 text-sm hover:bg-gray-100 data-disabled:cursor-not-allowed data-disabled:opacity-50 data-[highlighted=true]:bg-gray-200 data-[selected=true]:bg-blue-50 data-[selected=true]:text-blue-600"
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
    label: '라벨입니다',
  } as Story['args'],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button');

    // 초기 상태: 팝업이 닫혀있어야 함
    const popup = canvasElement.querySelector('[role="listbox"]');
    expect(popup).not.toBeInTheDocument();

    // 트리거 클릭 시 팝업이 열려야 함
    await userEvent.click(trigger);
    const openPopup = canvasElement.querySelector('[role="listbox"]');
    expect(openPopup).toBeInTheDocument();

    // 옵션 클릭 시 팝업이 닫히고 값이 변경되어야 함
    const option1 = canvas.getByText('옵션 1');
    await userEvent.click(option1);

    // 팝업이 닫혔는지 확인
    await expect(canvasElement.querySelector('[role="listbox"]')).not.toBeInTheDocument();

    // 선택된 값이 표시되는지 확인
    expect(trigger).toHaveTextContent('옵션 1');
  },
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
    label: '라벨입니다',
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
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button');

    // disabled 상태 확인
    expect(trigger).toBeDisabled();

    // disabled 상태에서 클릭해도 팝업이 열리지 않아야 함
    await userEvent.click(trigger);
    const popup = canvasElement.querySelector('[role="listbox"]');
    expect(popup).not.toBeInTheDocument();
  },
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
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button');

    // 팝업 열기
    await userEvent.click(trigger);
    const popup = canvasElement.querySelector('[role="listbox"]');
    expect(popup).toBeInTheDocument();

    // disabled 옵션은 클릭할 수 없어야 함
    const disabledOption = canvas.getByText('옵션 2');
    expect(disabledOption).toHaveAttribute('aria-disabled', 'true');
    expect(disabledOption).toHaveAttribute('data-disabled', 'true');

    // disabled 옵션 클릭 시도 (변경되지 않아야 함)
    await userEvent.click(disabledOption);
    // 팝업이 여전히 열려있어야 함
    expect(canvasElement.querySelector('[role="listbox"]')).toBeInTheDocument();

    // 활성화된 옵션 클릭 시 정상 작동
    const enabledOption = canvas.getByText('옵션 1');
    await userEvent.click(enabledOption);
    expect(canvasElement.querySelector('[role="listbox"]')).not.toBeInTheDocument();
    expect(trigger).toHaveTextContent('옵션 1');
  },
};

// 그룹 레이블이 있는 셀렉트를 위한 렌더 함수
const GroupSelect: Story['render'] = (args) => {
  const typedArgs = args as {
    value?: SelectOptionType;
    options: SelectOptionType[];
    disabled?: boolean;
    label?: string;
  };
  const [value, setValue] = useState<SelectOptionType | undefined>(typedArgs.value);

  return (
    <div className="w-64">
      <Select
        value={value}
        onChange={(option) => setValue(option)}
        options={typedArgs.options}
        disabled={typedArgs.disabled}
      >
        {typedArgs.label && <SelectLabel>{typedArgs.label}</SelectLabel>}
        <div className="relative">
          <SelectTrigger className="flex w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm hover:border-gray-400 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 data-state-open:border-blue-500 data-state-open:ring-2 data-state-open:ring-blue-500" />
          <SelectPopup className="absolute z-10 mt-1 w-full rounded-md border border-gray-300 bg-white shadow-lg">
            <SelectList className="max-h-60 overflow-auto py-1">
              <SelectGroup label="과일">
                <SelectOption
                  option={{ value: 'apple', label: '사과' }}
                  index={0}
                  className="cursor-pointer px-3 py-2 text-sm hover:bg-gray-100 data-disabled:cursor-not-allowed data-disabled:opacity-50 data-[highlighted=true]:bg-gray-200 data-[selected=true]:bg-blue-50 data-[selected=true]:text-blue-600"
                />
                <SelectOption
                  option={{ value: 'banana', label: '바나나' }}
                  index={1}
                  className="cursor-pointer px-3 py-2 text-sm hover:bg-gray-100 data-disabled:cursor-not-allowed data-disabled:opacity-50 data-[highlighted=true]:bg-gray-200 data-[selected=true]:bg-blue-50 data-[selected=true]:text-blue-600"
                />
                <SelectOption
                  option={{ value: 'orange', label: '오렌지' }}
                  index={2}
                  className="cursor-pointer px-3 py-2 text-sm hover:bg-gray-100 data-disabled:cursor-not-allowed data-disabled:opacity-50 data-[highlighted=true]:bg-gray-200 data-[selected=true]:bg-blue-50 data-[selected=true]:text-blue-600"
                />
              </SelectGroup>
              <SelectGroup label="채소">
                <SelectOption
                  option={{ value: 'carrot', label: '당근' }}
                  index={3}
                  className="cursor-pointer px-3 py-2 text-sm hover:bg-gray-100 data-disabled:cursor-not-allowed data-disabled:opacity-50 data-[selected=true]:bg-blue-50 data-[selected=true]:text-blue-600"
                />
                <SelectOption
                  option={{ value: 'tomato', label: '토마토' }}
                  index={4}
                  className="cursor-pointer px-3 py-2 text-sm hover:bg-gray-100 data-disabled:cursor-not-allowed data-disabled:opacity-50 data-[selected=true]:bg-blue-50 data-[selected=true]:text-blue-600"
                />
                <SelectOption
                  option={{ value: 'lettuce', label: '상추' }}
                  index={5}
                  className="cursor-pointer px-3 py-2 text-sm hover:bg-gray-100 data-disabled:cursor-not-allowed data-disabled:opacity-50 data-[selected=true]:bg-blue-50 data-[selected=true]:text-blue-600"
                />
              </SelectGroup>
            </SelectList>
          </SelectPopup>
        </div>
      </Select>
    </div>
  );
};

export const WithGroups: Story = {
  render: GroupSelect,
  args: {
    value: undefined,
    options: [
      { value: 'apple', label: '사과' },
      { value: 'banana', label: '바나나' },
      { value: 'orange', label: '오렌지' },
      { value: 'carrot', label: '당근' },
      { value: 'tomato', label: '토마토' },
      { value: 'lettuce', label: '상추' },
    ],
    children: null,
  } as Story['args'],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button');

    // 팝업 열기
    await userEvent.click(trigger);
    const popup = canvasElement.querySelector('[role="listbox"]');
    expect(popup).toBeInTheDocument();

    // 그룹 레이블 확인
    expect(canvas.getByText('과일')).toBeInTheDocument();
    expect(canvas.getByText('채소')).toBeInTheDocument();

    // 그룹 내 옵션 선택
    const appleOption = canvas.getByText('사과');
    await userEvent.click(appleOption);

    // 팝업이 닫히고 값이 변경되었는지 확인
    expect(canvasElement.querySelector('[role="listbox"]')).not.toBeInTheDocument();
    expect(trigger).toHaveTextContent('사과');
  },
};
