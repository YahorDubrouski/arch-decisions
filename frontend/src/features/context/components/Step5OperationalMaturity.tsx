import {ProjectContext} from '@/domain/context';
import styles from './Step5OperationalMaturity.module.css';

interface Step5OperationalMaturityProps {
    value: ProjectContext['operationalMaturity'] | null;
    onChange: (value: ProjectContext['operationalMaturity']) => void;
    error?: string;
}

export function Step5OperationalMaturity({value, onChange, error}: Step5OperationalMaturityProps) {
    const selectClassName = error ? `${styles.select} ${styles.selectError}` : styles.select;
    const errorId = 'operational-maturity-error';

    return (
        <div className={styles.container}>
            <label htmlFor="operational-maturity">Operational Maturity</label>
            <select
                id="operational-maturity"
                value={value ?? ''}
                onChange={(event) => onChange(event.target.value as ProjectContext['operationalMaturity'])}
                className={selectClassName}
                aria-invalid={error ? true : undefined}
                aria-describedby={error ? errorId : undefined}
            >
                <option value="">Select operational maturity</option>
                <option value="minimal">Minimal</option>
                <option value="moderate">Moderate</option>
                <option value="advanced">Advanced</option>
                <option value="enterprise">Enterprise</option>
            </select>
            {error && (
                <span id={errorId} className={styles.errorMessage} role="alert">
                    {error}
                </span>
            )}
        </div>
    );
}
