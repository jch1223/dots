import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it } from 'vitest';

import {
  Select,
  SelectLabel,
  SelectList,
  SelectOption,
  SelectPopup,
  SelectTrigger,
} from './Select';

import type { SelectOptionType } from './model/types';

// Wrapper component to manage state for testing
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

    // Open with Enter
    await user.keyboard('{Enter}');
    expect(screen.getByRole('listbox')).toBeInTheDocument();

    // Navigate down
    await user.keyboard('{ArrowDown}'); // Apple (highlighted)

    // We can't easily check highlighted state without implementation details or aria-activedescendant
    // But we can check if selecting works after navigation

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
});
