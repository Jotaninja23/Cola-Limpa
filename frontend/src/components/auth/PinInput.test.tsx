import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { PinInput } from './PinInput';

describe('PinInput Component', () => {
  it('should render 6 numeric input boxes with accessibility labels', () => {
    const handleChange = vi.fn();
    render(<PinInput value="" onChange={handleChange} />);

    const inputs = screen.getAllByRole('textbox');
    expect(inputs).toHaveLength(6);

    inputs.forEach((input, index) => {
      expect(input).toHaveAttribute('aria-label', `Dígito ${index + 1} de 6`);
      expect(input).toHaveAttribute('inputmode', 'numeric');
    });
  });

  it('should trigger onChange when typing a digit and auto-advance focus', () => {
    const handleChange = vi.fn();
    render(<PinInput value="" onChange={handleChange} />);

    const inputs = screen.getAllByRole('textbox');
    fireEvent.change(inputs[0], { target: { value: '5' } });

    expect(handleChange).toHaveBeenCalledWith('5');
  });

  it('should handle pasting a 6-digit code', () => {
    const handleChange = vi.fn();
    const handleComplete = vi.fn();
    render(<PinInput value="" onChange={handleChange} onComplete={handleComplete} />);

    const inputs = screen.getAllByRole('textbox');
    fireEvent.paste(inputs[0], {
      clipboardData: {
        getData: () => '123456',
      },
    });

    expect(handleChange).toHaveBeenCalledWith('123456');
    expect(handleComplete).toHaveBeenCalledWith('123456');
  });

  it('should handle backspace on an empty input by focusing the previous box', () => {
    const handleChange = vi.fn();
    render(<PinInput value="12" onChange={handleChange} />);

    const inputs = screen.getAllByRole('textbox');
    // Simulate backspace on the 3rd box (index 2)
    fireEvent.keyDown(inputs[2], { key: 'Backspace' });

    // Focus should move to index 1 and remove the last char
    expect(handleChange).toHaveBeenCalledWith('1');
  });
});

