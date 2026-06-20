import { memo } from 'react';

interface AfaqLogoSvgProps {
  height?: number;
  showWordmark?: boolean;
  className?: string;
}

/** All-white vector logo — transparent background, premium dark-mode safe */
export const AfaqLogoSvg = memo(function AfaqLogoSvg({
  height = 32,
  showWordmark = false,
  className = '',
}: AfaqLogoSvgProps) {
  const markSize = height;
  const width = showWordmark ? Math.round(height * 3.55) : markSize;

  return (
    <svg
      width={width}
      height={height}
      viewBox={showWordmark ? '0 0 140 40' : '0 0 40 40'}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <g transform={showWordmark ? 'translate(0, 4) scale(0.85)' : undefined}>
        {/* Octagonal ring mark */}
        <path
          fill="currentColor"
          fillRule="evenodd"
          clipRule="evenodd"
          d="M20 2 31.5 7.5 34 20 31.5 32.5 20 38 8.5 32.5 6 20 8.5 7.5 20 2Zm0 4.8L12.8 11v9.8L20 33.2l7.2-12.4V11L20 6.8Z"
        />
        {/* Inner accent square */}
        <rect x="17.6" y="10.2" width="4.8" height="4.8" rx="0.5" fill="currentColor" />
        {/* Stylized inner channel */}
        <path
          fill="currentColor"
          d="M20 16.2c-1.6 0-2.9 1.3-2.9 2.9v3.4c0 1.6 1.3 2.9 2.9 2.9s2.9-1.3 2.9-2.9v-3.4c0-1.6-1.3-2.9-2.9-2.9Zm0 1.8c.6 0 1.1.5 1.1 1.1v3.4a1.1 1.1 0 1 1-2.2 0v-3.4c0-.6.5-1.1 1.1-1.1Z"
        />
      </g>

      {showWordmark && (
        <g fill="currentColor">
          <text
            x="44"
            y="16"
            fontSize="12"
            fontFamily="var(--font-tajawal), 'Segoe UI', sans-serif"
            fontWeight="700"
          >
            أفق
          </text>
          <text
            x="44"
            y="31"
            fontSize="10"
            fontFamily="var(--font-inter), system-ui, sans-serif"
            fontWeight="300"
            letterSpacing="0.42em"
          >
            A F A Q
          </text>
        </g>
      )}
    </svg>
  );
});
