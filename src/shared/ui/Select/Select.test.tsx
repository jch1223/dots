import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it } from 'vitest';

import {
  Select,
  SelectContainer,
  SelectLabel,
  SelectList,
  SelectOption,
  SelectPopup,
  SelectTrigger,
} from './Select';

import type { SelectOptionType } from './model/types';

// 테스트를 위한 상태 관리 래퍼 컴포넌트
function SelectTestWrapper({
  initialValue,
  disabled = false,
  label,
}: {
  initialValue?: SelectOptionType;
  disabled?: boolean;
  label?: string;
}) {
  const [value, setValue] = useState<SelectOptionType | undefined>(initialValue);

  return (
    <Select value={value} onChange={setValue} disabled={disabled}>
      {label && <SelectLabel>{label}</SelectLabel>}
      <SelectTrigger label="Select Fruit" />
      <SelectPopup>
        <SelectList>
          <SelectOption option={{ value: 'apple', label: 'Apple' }} />
          <SelectOption option={{ value: 'banana', label: 'Banana' }} />
          <SelectOption option={{ value: 'orange', label: 'Orange' }} disabled />
        </SelectList>
      </SelectPopup>
    </Select>
  );
}

describe('Select Component', () => {
  it('renders correctly with default props', () => {
    render(<SelectTestWrapper />);

    expect(screen.getByRole('button', { name: /Select Fruit/i })).toBeInTheDocument();
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('opens the listbox when trigger is clicked', async () => {
    const user = userEvent.setup();
    render(<SelectTestWrapper />);

    const trigger = screen.getByRole('button', { name: /Select Fruit/i });
    await user.click(trigger);

    expect(screen.getByRole('listbox')).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Apple' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Banana' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Orange' })).toBeInTheDocument();
  });

  it('selects an option and closes the listbox', async () => {
    const user = userEvent.setup();
    render(<SelectTestWrapper />);

    const trigger = screen.getByRole('button', { name: /Select Fruit/i });
    await user.click(trigger);

    const appleOption = screen.getByRole('option', { name: 'Apple' });
    await user.click(appleOption);

    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    expect(screen.getByRole('button')).toHaveTextContent('Apple');
  });

  it('does not select disabled options', async () => {
    const user = userEvent.setup();
    render(<SelectTestWrapper />);

    const trigger = screen.getByRole('button', { name: /Select Fruit/i });
    await user.click(trigger);

    const orangeOption = screen.getByRole('option', { name: 'Orange' });
    await user.click(orangeOption);

    expect(screen.getByRole('listbox')).toBeInTheDocument();
    expect(screen.getByRole('button')).toHaveTextContent('Select Fruit');
  });

  it('navigates with keyboard arrow keys', async () => {
    const user = userEvent.setup();
    render(<SelectTestWrapper />);

    const trigger = screen.getByRole('button', { name: /Select Fruit/i });
    trigger.focus();

    // Enter로 열기
    await user.keyboard('{Enter}');
    expect(screen.getByRole('listbox')).toBeInTheDocument();

    // 아래로 탐색
    await user.keyboard('{ArrowDown}'); // Apple (highlighted)

    // aria-activedescendant가 설정되었는지 확인
    const appleOption = screen.getByRole('option', { name: 'Apple' });
    expect(trigger).toHaveAttribute('aria-activedescendant', appleOption.id);

    await user.keyboard('{Enter}');
    expect(screen.getByRole('button')).toHaveTextContent('Apple');
  });

  it('closes on Escape key', async () => {
    const user = userEvent.setup();
    render(<SelectTestWrapper />);

    const trigger = screen.getByRole('button', { name: /Select Fruit/i });
    await user.click(trigger);
    expect(screen.getByRole('listbox')).toBeInTheDocument();

    await user.keyboard('{Escape}');
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('respects disabled prop on Select', async () => {
    const user = userEvent.setup();
    render(<SelectTestWrapper disabled />);

    const trigger = screen.getByRole('button', { name: /Select Fruit/i });
    expect(trigger).toBeDisabled();

    await user.click(trigger);
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('closes when clicking outside with SelectContainer', async () => {
    const user = userEvent.setup();

    render(
      <div>
        <Select value={undefined} onChange={() => {}}>
          <SelectContainer data-testid="select-container">
            <SelectTrigger label="외부 클릭 테스트" />
            <SelectPopup>
              <SelectList>
                <SelectOption option={{ value: 'option1', label: '옵션 1' }} />
                <SelectOption option={{ value: 'option2', label: '옵션 2' }} />
              </SelectList>
            </SelectPopup>
          </SelectContainer>
        </Select>
        <div data-testid="outside-area">외부 영역</div>
      </div>,
    );

    const trigger = screen.getByRole('button', { name: /외부 클릭 테스트/i });

    // 팝업 열기
    await user.click(trigger);
    expect(screen.getByRole('listbox')).toBeInTheDocument();

    // 외부 영역 클릭
    const outsideArea = screen.getByTestId('outside-area');
    await user.click(outsideArea);

    // 팝업이 닫혔는지 확인
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });
});
