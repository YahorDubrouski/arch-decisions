import styles from './PageVisualAccent.module.css';

type PageVisualAccentProps = {
    variant: 'context' | 'recommendations' | 'documents';
};

const VARIANT_COPY = {
    context: {
        title: 'Constraint map',
        detail: 'Capture the inputs that shape infrastructure choices.',
    },
    recommendations: {
        title: 'Trade-off lanes',
        detail: 'Compute, secrets, and CI/CD scored against your context.',
    },
    documents: {
        title: 'Decision archive',
        detail: 'Persisted ADRs you can filter, page, and revisit.',
    },
} as const;

export function PageVisualAccent({variant}: PageVisualAccentProps) {
    const copy = VARIANT_COPY[variant];

    return (
        <aside className={`${styles.accent} ${styles[variant]}`} aria-hidden="true">
            <div className={styles.diagram}>
                {variant === 'context' && <ContextGlyph/>}
                {variant === 'recommendations' && <RecommendationsGlyph/>}
                {variant === 'documents' && <DocumentsGlyph/>}
            </div>
            <div>
                <p className={styles.title}>{copy.title}</p>
                <p className={styles.detail}>{copy.detail}</p>
            </div>
        </aside>
    );
}

function ContextGlyph() {
    return (
        <svg viewBox="0 0 96 64" className={styles.glyph} fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="4" y="10" width="28" height="18" rx="5" stroke="currentColor" strokeWidth="2"/>
            <rect x="34" y="10" width="28" height="18" rx="5" stroke="currentColor" strokeWidth="2"/>
            <rect x="64" y="10" width="28" height="18" rx="5" stroke="currentColor" strokeWidth="2"/>
            <path d="M18 28v10h60v10" stroke="currentColor" strokeWidth="2"/>
            <rect x="28" y="42" width="40" height="14" rx="5" fill="currentColor" opacity="0.15" stroke="currentColor" strokeWidth="2"/>
        </svg>
    );
}

function RecommendationsGlyph() {
    return (
        <svg viewBox="0 0 96 64" className={styles.glyph} fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="6" y="8" width="24" height="48" rx="6" stroke="currentColor" strokeWidth="2"/>
            <rect x="36" y="8" width="24" height="48" rx="6" stroke="currentColor" strokeWidth="2"/>
            <rect x="66" y="8" width="24" height="48" rx="6" stroke="currentColor" strokeWidth="2"/>
            <path d="M12 44h12M42 36h12M72 28h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
    );
}

function DocumentsGlyph() {
    return (
        <svg viewBox="0 0 96 64" className={styles.glyph} fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="18" y="6" width="44" height="52" rx="6" stroke="currentColor" strokeWidth="2"/>
            <path d="M28 18h24M28 28h24M28 38h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <rect x="40" y="14" width="38" height="44" rx="6" fill="currentColor" opacity="0.12" stroke="currentColor" strokeWidth="2"/>
        </svg>
    );
}
