import styles from './ArchitectureFlowDiagram.module.css';

type ArchitectureFlowDiagramProps = {
    className?: string;
};

/**
 * Brand diagram: context constraints flow into recommendation lanes, then an ADR.
 */
export function ArchitectureFlowDiagram({className}: ArchitectureFlowDiagramProps) {
    return (
        <div className={`${styles.frame} ${className ?? ''}`.trim()} aria-hidden="true">
            <svg
                className={styles.svg}
                viewBox="0 0 520 360"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                role="presentation"
            >
                <defs>
                    <linearGradient id="ad-surface" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.96"/>
                        <stop offset="100%" stopColor="#f1f5f9" stopOpacity="0.9"/>
                    </linearGradient>
                    <linearGradient id="ad-glow" x1="0.2" y1="0" x2="0.8" y2="1">
                        <stop offset="0%" stopColor="#14b8a6" stopOpacity="0.28"/>
                        <stop offset="55%" stopColor="#0284c7" stopOpacity="0.12"/>
                        <stop offset="100%" stopColor="#2563eb" stopOpacity="0.08"/>
                    </linearGradient>
                    <marker id="ad-arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
                        <path d="M0 0 L6 3 L0 6 Z" fill="#64748b"/>
                    </marker>
                </defs>

                <rect x="8" y="8" width="504" height="344" rx="24" fill="url(#ad-glow)"/>
                <rect x="20" y="20" width="480" height="320" rx="20" fill="url(#ad-surface)" stroke="#cbd5e1"/>

                {/* Context */}
                <rect x="48" y="56" width="130" height="72" rx="12" fill="#fff" stroke="#94a3b8"/>
                <text x="113" y="88" textAnchor="middle" className={styles.label}>
                    Context
                </text>
                <text x="113" y="108" textAnchor="middle" className={styles.detail}>
                    team · traffic · budget
                </text>

                <line x1="178" y1="92" x2="228" y2="92" stroke="#64748b" strokeWidth="2" markerEnd="url(#ad-arrow)"/>

                {/* Engine */}
                <rect x="230" y="48" width="120" height="88" rx="14" fill="#0f766e" stroke="#0d9488"/>
                <text x="290" y="88" textAnchor="middle" className={styles.labelOnDark}>
                    Rules
                </text>
                <text x="290" y="108" textAnchor="middle" className={styles.detailOnDark}>
                    evaluate
                </text>

                {/* Recommendation lanes */}
                <line x1="350" y1="72" x2="392" y2="72" stroke="#64748b" strokeWidth="2" markerEnd="url(#ad-arrow)"/>
                <line x1="350" y1="92" x2="392" y2="148" stroke="#64748b" strokeWidth="2" markerEnd="url(#ad-arrow)"/>
                <line x1="350" y1="112" x2="392" y2="224" stroke="#64748b" strokeWidth="2" markerEnd="url(#ad-arrow)"/>

                <rect x="396" y="48" width="88" height="48" rx="10" fill="rgba(37,99,235,0.12)" stroke="#2563eb"/>
                <text x="440" y="78" textAnchor="middle" className={styles.lane}>
                    Compute
                </text>

                <rect x="396" y="124" width="88" height="48" rx="10" fill="rgba(124,58,237,0.12)" stroke="#7c3aed"/>
                <text x="440" y="154" textAnchor="middle" className={styles.lane}>
                    Secrets
                </text>

                <rect x="396" y="200" width="88" height="48" rx="10" fill="rgba(234,88,12,0.12)" stroke="#ea580c"/>
                <text x="440" y="230" textAnchor="middle" className={styles.lane}>
                    CI/CD
                </text>

                {/* Merge to ADR */}
                <path
                    d="M440 248 C440 278 360 286 290 286"
                    stroke="#64748b"
                    strokeWidth="2"
                    fill="none"
                    markerEnd="url(#ad-arrow)"
                />

                <rect x="200" y="268" width="180" height="52" rx="12" fill="#fff" stroke="#0f766e" strokeWidth="2"/>
                <text x="290" y="292" textAnchor="middle" className={styles.label}>
                    Architecture Decision
                </text>
                <text x="290" y="308" textAnchor="middle" className={styles.detail}>
                    documented trade-offs
                </text>

                {/* Ambient nodes */}
                <circle cx="72" cy="300" r="5" fill="#14b8a6" opacity="0.55"/>
                <circle cx="92" cy="312" r="3.5" fill="#0284c7" opacity="0.45"/>
                <circle cx="108" cy="296" r="4" fill="#2563eb" opacity="0.35"/>
            </svg>
        </div>
    );
}
