import React, { useState } from 'react';
import { expect, userEvent, within } from 'storybook/test';

import {
  Select,
  SelectContainer,
  SelectGroup,
  SelectLabel,
  SelectList,
  SelectOption,
  SelectPopup,
  SelectTrigger,
} from './Select';

import type { SelectOptionType, SelectProps } from './model/types';
import type { Meta, StoryObj } from '@storybook/react-vite';

type SelectStoryProps = Omit<SelectProps, 'children'> & {
  children?: React.ReactNode;
};

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
type Story = StoryObj<SelectStoryProps>;

// 공통 스타일 정의
const triggerClassName =
  'flex w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm hover:border-gray-400 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 data-state-open:border-blue-500 data-state-open:ring-2 data-state-open:ring-blue-500';
const popupClassName =
  'absolute z-10 mt-1 w-full rounded-md border border-gray-300 bg-white shadow-lg';
const optionClassName =
  'cursor-pointer px-3 py-2 text-sm hover:bg-gray-100 data-disabled:cursor-not-allowed data-disabled:opacity-50 data-[highlighted=true]:bg-gray-200 data-[selected=true]:bg-blue-50 data-[selected=true]:text-blue-600 data-[selected=true]:data-[highlighted=true]:bg-blue-100';

const DefaultSelect: Story['render'] = (args) => {
  const [value, setValue] = useState<SelectOptionType | undefined>();

  return (
    <div className="w-64">
      <Select value={value} onChange={setValue} disabled={args.disabled}>
        <div className="relative">
          <SelectTrigger label={args.label || '과일'} className={triggerClassName} />
          <SelectPopup className={popupClassName}>
            <SelectList className="max-h-60 overflow-auto py-1">
              <SelectOption
                option={{ value: 'option1', label: '옵션 1' }}
                className={optionClassName}
              />
              <SelectOption
                option={{ value: 'option2', label: '옵션 2' }}
                className={optionClassName}
              />
              <SelectOption
                option={{ value: 'option3', label: '옵션 3' }}
                className={optionClassName}
              />
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
    label: '라벨입니다',
  },
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
    label: '라벨입니다',
  },
};

export const Disabled: Story = {
  render: DefaultSelect,
  args: {
    disabled: true,
    label: '라벨입니다',
  },
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

const DisabledOptionSelect: Story['render'] = (args) => {
  const [value, setValue] = useState<SelectOptionType | undefined>();

  return (
    <div className="w-64">
      <Select value={value} onChange={setValue} disabled={args.disabled}>
        <div className="relative">
          <SelectTrigger label={args.label || '과일'} className={triggerClassName} />
          <SelectPopup className={popupClassName}>
            <SelectList className="max-h-60 overflow-auto py-1">
              <SelectOption
                option={{ value: 'option1', label: '옵션 1' }}
                className={optionClassName}
              />
              <SelectOption
                option={{ value: 'option2', label: '옵션 2' }}
                disabled
                className={optionClassName}
              />
              <SelectOption
                option={{ value: 'option3', label: '옵션 3' }}
                className={optionClassName}
              />
            </SelectList>
          </SelectPopup>
        </div>
      </Select>
    </div>
  );
};

export const WithDisabledOption: Story = {
  render: DisabledOptionSelect,
  args: {
    disabled: false,
    label: '라벨입니다',
  },
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

const GroupSelect: Story['render'] = (args) => {
  const [value, setValue] = useState<SelectOptionType | undefined>();

  return (
    <div className="w-64">
      <Select value={value} onChange={setValue} disabled={args.disabled}>
        {args.label && <SelectLabel>{args.label}</SelectLabel>}
        <div className="relative">
          <SelectTrigger className={triggerClassName} />
          <SelectPopup className={popupClassName}>
            <SelectList className="max-h-60 overflow-auto py-1">
              <SelectGroup label="과일">
                <SelectOption
                  option={{ value: 'apple', label: '사과' }}
                  className={optionClassName}
                />
                <SelectOption
                  option={{ value: 'banana', label: '바나나' }}
                  className={optionClassName}
                />
                <SelectOption
                  option={{ value: 'orange', label: '오렌지' }}
                  className={optionClassName}
                />
              </SelectGroup>
              <SelectGroup label="채소">
                <SelectOption
                  option={{ value: 'carrot', label: '당근' }}
                  className={optionClassName}
                />
                <SelectOption
                  option={{ value: 'tomato', label: '토마토' }}
                  className={optionClassName}
                />
                <SelectOption
                  option={{ value: 'lettuce', label: '상추' }}
                  className={optionClassName}
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
    label: '식료품',
  },
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

const ClickOutsideSelect: Story['render'] = (args) => {
  const [value, setValue] = useState<SelectOptionType | undefined>();

  return (
    <div className="w-64">
      <Select value={value} onChange={setValue} disabled={args.disabled}>
        <SelectContainer className="relative">
          <SelectTrigger label={args.label || '외부 클릭 테스트'} className={triggerClassName} />
          <SelectPopup className={popupClassName}>
            <SelectList className="max-h-60 overflow-auto py-1">
              <SelectOption
                option={{ value: 'option1', label: '옵션 1' }}
                className={optionClassName}
              />
              <SelectOption
                option={{ value: 'option2', label: '옵션 2' }}
                className={optionClassName}
              />
              <SelectOption
                option={{ value: 'option3', label: '옵션 3' }}
                className={optionClassName}
              />
            </SelectList>
          </SelectPopup>
        </SelectContainer>
      </Select>
      <div className="mt-4 rounded border border-dashed border-gray-400 p-4 text-sm text-gray-500">
        SelectContainer를 사용하면 외부 클릭 시 자동으로 닫힙니다.
      </div>
    </div>
  );
};

export const WithClickOutside: Story = {
  render: ClickOutsideSelect,
  args: {
    label: '외부 클릭 테스트',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button');

    // 팝업 열기
    await userEvent.click(trigger);
    expect(canvasElement.querySelector('[role="listbox"]')).toBeInTheDocument();

    // 외부 클릭 (설명 텍스트 영역 클릭)
    const outsideArea = canvas.getByText(
      'SelectContainer를 사용하면 외부 클릭 시 자동으로 닫힙니다.',
    );
    await userEvent.click(outsideArea);

    // 팝업이 닫혔는지 확인
    expect(canvasElement.querySelector('[role="listbox"]')).not.toBeInTheDocument();
  },
};
