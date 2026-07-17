type IconProps = {
    size?: number;
    className?: string;
};

const defaultSize = 20;

export function HomeIcon({size = defaultSize, className}: IconProps) {
    return (
        <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
                d="M4 10.5 12 4l8 6.5V19a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1v-8.5z"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinejoin="round"
            />
        </svg>
    );
}

export function ContextIcon({size = defaultSize, className}: IconProps) {
    return (
        <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <rect x="4" y="5" width="16" height="14" rx="2" stroke="currentColor" strokeWidth="1.75"/>
            <path d="M8 9h8M8 13h5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"/>
        </svg>
    );
}

export function RecommendationsIcon({size = defaultSize, className}: IconProps) {
    return (
        <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M6 7h12M6 12h12M6 17h8" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"/>
            <circle cx="18" cy="17" r="2" fill="currentColor"/>
        </svg>
    );
}

export function ComputeIcon({size = defaultSize, className}: IconProps) {
    return (
        <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <rect x="5" y="6" width="14" height="12" rx="2" stroke="currentColor" strokeWidth="1.75"/>
            <path d="M9 10h6M9 14h4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"/>
            <path d="M8 18h8" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"/>
        </svg>
    );
}

export function SecretsIcon({size = defaultSize, className}: IconProps) {
    return (
        <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <rect x="6" y="10" width="12" height="10" rx="2" stroke="currentColor" strokeWidth="1.75"/>
            <path
                d="M9 10V8a3 3 0 0 1 6 0v2"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
            />
            <circle cx="12" cy="15" r="1.5" fill="currentColor"/>
        </svg>
    );
}

export function CicdIcon({size = defaultSize, className}: IconProps) {
    return (
        <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
                d="M7 7h7l3 3v7H7V7z"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinejoin="round"
            />
            <path d="M14 7v3h3M9 13h6M9 16h4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"/>
        </svg>
    );
}

export function DocumentIcon({size = defaultSize, className}: IconProps) {
    return (
        <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
                d="M8 4h8l4 4v12a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1z"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinejoin="round"
            />
            <path d="M16 4v4h4M10 12h6M10 16h4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"/>
        </svg>
    );
}

export function CheckCircleIcon({size = defaultSize, className}: IconProps) {
    return (
        <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.75"/>
            <path d="m8.5 12.5 2.5 2.5 4.5-5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
    );
}

export function SparkIcon({size = defaultSize, className}: IconProps) {
    return (
        <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
                d="M12 3l1.6 5.4L19 10l-5.4 1.6L12 17l-1.6-5.4L5 10l5.4-1.6L12 3z"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinejoin="round"
            />
        </svg>
    );
}

export function ArrowRightIcon({size = defaultSize, className}: IconProps) {
    return (
        <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
    );
}

export function EmptyRecommendationsIcon({size = 48, className}: IconProps) {
    return (
        <svg className={className} width={size} height={size} viewBox="0 0 64 64" fill="none" aria-hidden="true">
            <rect x="12" y="10" width="40" height="44" rx="4" stroke="currentColor" strokeWidth="2"/>
            <path d="M20 22h24M20 30h18M20 38h22" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <circle cx="46" cy="46" r="10" fill="var(--color-primary-soft)" stroke="var(--color-primary)" strokeWidth="2"/>
            <path d="M43 46h6M46 43v6" stroke="var(--color-primary)" strokeWidth="2" strokeLinecap="round"/>
        </svg>
    );
}

export function ChevronIcon({size = defaultSize, className}: IconProps) {
    return (
        <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
                d="m6 9 6 6 6-6"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}
