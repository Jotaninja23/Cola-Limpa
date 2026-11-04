import React, { useRef, useEffect } from 'react';

interface PinInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  onComplete?: (code: string) => void;
}

export const PinInput: React.FC<PinInputProps> = ({
  value,
  onChange,
  disabled = false,
  onComplete,
}) => {
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    // Foca na primeira caixa ao montar
    inputsRef.current[0]?.focus();
  }, []);

  const handleChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const char = e.target.value.slice(-1);
    if (char && !/^\d$/.test(char)) return;

    const chars = value.split('');
    chars[index] = char || '';
    const newValue = chars.join('').slice(0, 6);
    onChange(newValue);

    if (char && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }

    if (newValue.length === 6 && onComplete) {
      onComplete(newValue);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (!value[index] && index > 0) {
        const chars = value.split('');
        chars[index - 1] = '';
        onChange(chars.join(''));
        inputsRef.current[index - 1]?.focus();
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      e.preventDefault();
      inputsRef.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < 5) {
      e.preventDefault();
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text/plain').replace(/\D/g, '').slice(0, 6);
    if (!pastedData) return;

    onChange(pastedData);
    const targetIndex = Math.min(pastedData.length, 5);
    inputsRef.current[targetIndex]?.focus();

    if (pastedData.length === 6 && onComplete) {
      onComplete(pastedData);
    }
  };

  return (
    <div className="pin-input-container" role="group" aria-label="Código de verificação de 6 dígitos">
      {[0, 1, 2, 3, 4, 5].map((index) => {
        const digit = value[index] || '';
        return (
          <input
            key={index}
            ref={(el) => {
              inputsRef.current[index] = el;
            }}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(index, e)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            disabled={disabled}
            className="pin-digit-box"
            aria-label={`Dígito ${index + 1} de 6`}
            autoComplete="one-time-code"
          />
        );
      })}
    </div>
  );
};
