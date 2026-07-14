import {COMPLIANCE_OPTIONS} from '@/domain/complianceOptions';
import styles from './Step4ComplianceRequirements.module.css';

interface Step4ComplianceRequirementsProps {
    value: string[];
    onChange: (value: string[]) => void;
    error?: string;
}

export function Step4ComplianceRequirements({value, onChange, error}: Step4ComplianceRequirementsProps) {
    const errorId = 'compliance-requirements-error';
    const optionsClassName = error ? `${styles.options} ${styles.optionsError}` : styles.options;

    function toggleRequirement(requirement: string) {
        if (value.includes(requirement)) {
            onChange(value.filter((item) => item !== requirement));
            return;
        }

        onChange([...value, requirement]);
    }

    return (
        <fieldset className={styles.container}>
            <legend className={styles.legend}>Compliance Requirements</legend>
            <div
                className={optionsClassName}
                aria-invalid={error ? true : undefined}
                aria-describedby={error ? errorId : undefined}
            >
                {COMPLIANCE_OPTIONS.map((requirement) => (
                    <label key={requirement} className={styles.option}>
                        <input
                            type="checkbox"
                            checked={value.includes(requirement)}
                            onChange={() => toggleRequirement(requirement)}
                        />
                        {requirement}
                    </label>
                ))}
            </div>
            {error && (
                <span id={errorId} className={styles.errorMessage} role="alert">
                    {error}
                </span>
            )}
        </fieldset>
    );
}
