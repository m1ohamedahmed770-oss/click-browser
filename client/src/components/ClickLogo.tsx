/**
 * Click Logo Component
 * Displays a cursor/pointer icon with neon effects
 */
export function ClickLogo({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={`w-8 h-8 ${className}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Outer glow */}
      <circle
        cx="50"
        cy="50"
        r="48"
        stroke="url(#glowGradient)"
        strokeWidth="1"
        opacity="0.5"
      />

      {/* Cursor pointer shape */}
      <g>
        {/* Main cursor body */}
        <path
          d="M 20 15 L 20 65 L 35 50 L 50 70 L 60 65 L 45 45 L 65 45 Z"
          fill="url(#cursorGradient)"
          stroke="url(#cursorStroke)"
          strokeWidth="1.5"
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        {/* Highlight for depth */}
        <path
          d="M 22 17 L 22 50 L 32 42"
          stroke="rgba(255, 255, 255, 0.6)"
          strokeWidth="1"
          fill="none"
          strokeLinecap="round"
        />
      </g>

      {/* Animated click ripple */}
      <circle
        cx="50"
        cy="50"
        r="15"
        fill="none"
        stroke="url(#rippleGradient)"
        strokeWidth="1.5"
        opacity="0.3"
        className="animate-pulse"
      />

      {/* Gradients */}
      <defs>
        {/* Neon Purple Gradient */}
        <linearGradient id="cursorGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="rgb(200, 100, 255)" stopOpacity="1" />
          <stop offset="100%" stopColor="rgb(150, 50, 200)" stopOpacity="1" />
        </linearGradient>

        {/* Stroke with blue accent */}
        <linearGradient id="cursorStroke" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="rgb(100, 200, 255)" stopOpacity="1" />
          <stop offset="100%" stopColor="rgb(200, 100, 255)" stopOpacity="1" />
        </linearGradient>

        {/* Glow effect */}
        <radialGradient id="glowGradient" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgb(200, 100, 255)" stopOpacity="0.8" />
          <stop offset="100%" stopColor="rgb(200, 100, 255)" stopOpacity="0" />
        </radialGradient>

        {/* Ripple effect */}
        <linearGradient id="rippleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="rgb(100, 200, 255)" stopOpacity="1" />
          <stop offset="100%" stopColor="rgb(200, 100, 255)" stopOpacity="1" />
        </linearGradient>
      </defs>
    </svg>
  );
}
