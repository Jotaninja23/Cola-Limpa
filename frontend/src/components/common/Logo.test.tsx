import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Logo } from './Logo';

describe('Logo Component', () => {
  it('should render icon variant with proper accessible label', () => {
    render(<Logo size={48} />);
    const svg = screen.getByLabelText('Logo Cola Limpa');
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute('width', '48');
    expect(svg).toHaveAttribute('height', '48');
  });

  it('should render horizontal variant with brand text and tagline', () => {
    render(<Logo variant="horizontal" />);
    const svg = screen.getByLabelText('Cola Limpa - Estudos Gamificados');
    expect(svg).toBeInTheDocument();
    expect(screen.getByText('Cola Limpa')).toBeInTheDocument();
    expect(screen.getByText('ESTUDOS GAMIFICADOS')).toBeInTheDocument();
  });
});

