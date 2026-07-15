type LogoMarkProps = {
    size?: number;
    className?: string;
};

export function LogoMark({size = 40, className}: LogoMarkProps) {
    return (
        <svg
            className={className}
            width={size}
            height={size}
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
        >
            <rect width="40" height="40" rx="10" fill="url(#logoGradient)"/>
            <path
                d="M10 27V17l10-5 10 5v10l-10 5-10-5z"
                stroke="white"
                strokeWidth="1.75"
                strokeLinejoin="round"
            />
            <path
                d="M20 12v16M10 17l10 5 10-5"
                stroke="#99f6e4"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <circle cx="20" cy="20" r="3" fill="white"/>
            <defs>
                <linearGradient id="logoGradient" x1="8" y1="6" x2="34" y2="36" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#14b8a6"/>
                    <stop offset="1" stopColor="#0f766e"/>
                </linearGradient>
            </defs>
        </svg>
    );
}
