import React, { useId } from 'react';

export interface LogoProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  variant?: 'icon' | 'horizontal';
  className?: string;
  showText?: boolean;
}

/**
 * Logotipo oficial do projeto Cola Limpa.
 * Representa a fusão da Vela (foco, sabedoria, streak gamificado)
 * e da Cola (adesão de conceitos na memória, notas e sínteses acadêmicas).
 */
export const Logo: React.FC<LogoProps> = ({
  size = 42,
  variant = 'icon',
  className = '',
  showText = false,
  ...props
}) => {
  const uid = useId().replace(/:/g, '');

  const idBg = `cl-bg-${uid}`;
  const idCandle = `cl-candle-${uid}`;
  const idGlow = `cl-glow-${uid}`;
  const idFlame = `cl-flame-${uid}`;
  const idInnerFlame = `cl-inner-${uid}`;
  const idBase = `cl-base-${uid}`;

  if (variant === 'horizontal' || showText) {
    return (
      <svg
        viewBox="0 0 280 64"
        width={typeof size === 'number' ? size * 4.375 : size}
        height={size}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`cola-limpa-logo cola-limpa-logo-horizontal ${className}`}
        aria-label="Cola Limpa - Estudos Gamificados"
        {...props}
      >
        <defs>
          <linearGradient id={idBg} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3D2619" />
            <stop offset="50%" stopColor="#2B1A10" />
            <stop offset="100%" stopColor="#1A0F08" />
          </linearGradient>
          <linearGradient id={idCandle} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#B86638" />
            <stop offset="50%" stopColor="#9C5228" />
            <stop offset="100%" stopColor="#6E3516" />
          </linearGradient>
          <radialGradient id={idGlow} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#C57D1E" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#C57D1E" stopOpacity="0" />
          </radialGradient>
          <linearGradient id={idFlame} x1="0%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stopColor="#FFE885" />
            <stop offset="35%" stopColor="#F59E0B" />
            <stop offset="75%" stopColor="#D9631E" />
            <stop offset="100%" stopColor="#B43D12" />
          </linearGradient>
          <linearGradient id={idInnerFlame} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="40%" stopColor="#FFF3C4" />
            <stop offset="100%" stopColor="#FBBF24" />
          </linearGradient>
          <linearGradient id={idBase} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#D49A6A" />
            <stop offset="50%" stopColor="#A56338" />
            <stop offset="100%" stopColor="#633719" />
          </linearGradient>
        </defs>

        {/* Emblema da Vela e Gota (52x52) */}
        <g transform="translate(6, 6) scale(0.4333)">
          {/* Fundo Squircle */}
          <rect width="120" height="120" rx="28" fill={`url(#${idBg})`} />
          <rect x="1.5" y="1.5" width="117" height="117" rx="26.5" stroke="#E2D7C8" strokeOpacity="0.15" strokeWidth="1.5" />

          {/* Brilho da Chama */}
          <circle cx="60" cy="36" r="34" fill={`url(#${idGlow})`} />

          {/* Prato Base */}
          <ellipse cx="60" cy="95" rx="34" ry="7" fill={`url(#${idBase})`} />
          <ellipse cx="60" cy="94" rx="31" ry="5.5" fill="#422513" />
          <ellipse cx="60" cy="93.5" rx="28" ry="4" fill="#6E3B1C" />

          {/* Corpo da Vela */}
          <rect x="44" y="58" width="32" height="36" rx="4" fill={`url(#${idCandle})`} />

          {/* Gotas de Cola / Cera escorrendo */}
          <path d="M44 64 C44 70, 48 72, 48 67 C48 62, 44 60, 44 64 Z" fill="#D9804E" />
          <path d="M76 60 C76 65, 78 72, 78 76 C78 78.5, 75.5 80, 74 78 C72.5 76, 73 70, 74 65 Z" fill="#D9804E" />
          <circle cx="76.5" cy="76.5" r="2.2" fill="#ECA272" />

          {/* Borda superior da vela */}
          <ellipse cx="60" cy="58" rx="16" ry="4.5" fill="#C27344" />
          <ellipse cx="60" cy="58.5" rx="13" ry="3" fill="#84411C" />

          {/* Pavio */}
          <path d="M60 58 Q59 52 61 46" stroke="#24140B" strokeWidth="2.5" strokeLinecap="round" />

          {/* Chama / Gota de Cola Dourada */}
          <path
            d="M60 17 C66 26, 76 34, 76 43 C76 52, 69 57, 60 57 C51 57, 44 52, 44 43 C44 34, 54 26, 60 17 Z"
            fill={`url(#${idFlame})`}
          />
          <path
            d="M60 27 C63 32, 69 37, 69 43 C69 48, 65 52, 60 52 C55 52, 51 48, 51 43 C51 37, 57 32, 60 27 Z"
            fill={`url(#${idInnerFlame})`}
          />
          <path d="M54 33 Q54 30 52 30 Q54 30 54 27 Q54 30 56 30 Q54 30 54 33 Z" fill="#FFFFFF" opacity="0.95" />
        </g>

        {/* Tipografia da Marca */}
        <text
          x="72"
          y="34"
          fontFamily="'Nunito', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
          fontWeight="900"
          fontSize="23"
          fill="currentColor"
          letterSpacing="-0.5"
        >
          Cola Limpa
        </text>
        <text
          x="73"
          y="49"
          fontFamily="'Nunito', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
          fontWeight="700"
          fontSize="10"
          fill="#9C5228"
          letterSpacing="1.8"
        >
          ESTUDOS GAMIFICADOS
        </text>
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 120 120"
      width={size}
      height={size}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`cola-limpa-logo cola-limpa-logo-icon ${className}`}
      aria-label="Logo Cola Limpa"
      {...props}
    >
      <defs>
        <linearGradient id={idBg} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3D2619" />
          <stop offset="50%" stopColor="#2B1A10" />
          <stop offset="100%" stopColor="#1A0F08" />
        </linearGradient>

        <linearGradient id={idCandle} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#B86638" />
          <stop offset="50%" stopColor="#9C5228" />
          <stop offset="100%" stopColor="#6E3516" />
        </linearGradient>

        <radialGradient id={idGlow} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#C57D1E" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#C57D1E" stopOpacity="0" />
        </radialGradient>

        <linearGradient id={idFlame} x1="0%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor="#FFE885" />
          <stop offset="35%" stopColor="#F59E0B" />
          <stop offset="75%" stopColor="#D9631E" />
          <stop offset="100%" stopColor="#B43D12" />
        </linearGradient>

        <linearGradient id={idInnerFlame} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="40%" stopColor="#FFF3C4" />
          <stop offset="100%" stopColor="#FBBF24" />
        </linearGradient>

        <linearGradient id={idBase} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#D49A6A" />
          <stop offset="50%" stopColor="#A56338" />
          <stop offset="100%" stopColor="#633719" />
        </linearGradient>
      </defs>

      {/* Emblema Squircle */}
      <rect width="120" height="120" rx="28" fill={`url(#${idBg})`} />
      <rect x="1.5" y="1.5" width="117" height="117" rx="26.5" stroke="#E2D7C8" strokeOpacity="0.12" strokeWidth="1.5" />

      {/* Brilho da Chama */}
      <circle cx="60" cy="36" r="34" fill={`url(#${idGlow})`} />

      {/* Pratinho Base da Vela */}
      <ellipse cx="60" cy="95" rx="34" ry="7" fill={`url(#${idBase})`} />
      <ellipse cx="60" cy="94" rx="31" ry="5.5" fill="#422513" />
      <ellipse cx="60" cy="93.5" rx="28" ry="4" fill="#6E3B1C" />

      {/* Corpo da Vela */}
      <rect x="44" y="58" width="32" height="36" rx="4" fill={`url(#${idCandle})`} />

      {/* Gotas de Cola / Cera escorrendo */}
      <path d="M44 64 C44 70, 48 72, 48 67 C48 62, 44 60, 44 64 Z" fill="#D9804E" />
      <path d="M76 60 C76 65, 78 72, 78 76 C78 78.5, 75.5 80, 74 78 C72.5 76, 73 70, 74 65 Z" fill="#D9804E" />
      <circle cx="76.5" cy="76.5" r="2.2" fill="#ECA272" />

      {/* Borda superior côncava */}
      <ellipse cx="60" cy="58" rx="16" ry="4.5" fill="#C27344" />
      <ellipse cx="60" cy="58.5" rx="13" ry="3" fill="#84411C" />

      {/* Pavio */}
      <path d="M60 58 Q59 52 61 46" stroke="#24140B" strokeWidth="2.5" strokeLinecap="round" />

      {/* Chama em formato de Gota de Cola Dourada */}
      <path
        d="M60 17 C66 26, 76 34, 76 43 C76 52, 69 57, 60 57 C51 57, 44 52, 44 43 C44 34, 54 26, 60 17 Z"
        fill={`url(#${idFlame})`}
      />

      {/* Núcleo de Luz da Chama */}
      <path
        d="M60 27 C63 32, 69 37, 69 43 C69 48, 65 52, 60 52 C55 52, 51 48, 51 43 C51 37, 57 32, 60 27 Z"
        fill={`url(#${idInnerFlame})`}
      />

      {/* Brilho da Sabedoria / XP */}
      <path d="M54 33 Q54 30 52 30 Q54 30 54 27 Q54 30 56 30 Q54 30 54 33 Z" fill="#FFFFFF" opacity="0.95" />
    </svg>
  );
};

export default Logo;
