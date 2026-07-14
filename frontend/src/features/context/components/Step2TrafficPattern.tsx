import {ProjectContext} from '@/domain/context';
import styles from './Step2TrafficPattern.module.css';

interface Step2TrafficPatternProps {
    value: ProjectContext['trafficPattern'] | null;
    onChange: (value: ProjectContext['trafficPattern']) => void;
    error?: string;
}

export function Step2TrafficPattern({value, onChange, error}: Step2TrafficPatternProps) {
    const selectClassName = error ? `${styles.select} ${styles.selectError}` : styles.select;
    const errorId = 'traffic-pattern-error';

    return (
        <div className={styles.container}>
            <label htmlFor="traffic-pattern">Traffic Pattern</label>
            <select
                id="traffic-pattern"
                value={value ?? ''}
                onChange={(event) => onChange(event.target.value as ProjectContext['trafficPattern'])}
                className={selectClassName}
                aria-invalid={error ? true : undefined}
                aria-describedby={error ? errorId : undefined}
            >
                <option value="">Select traffic pattern</option>
                <option value="low-steady">Low, steady traffic</option>
                <option value="variable">Variable traffic</option>
                <option value="high-spike">High spike traffic</option>
                <option value="unpredictable">Unpredictable traffic</option>
            </select>
            {error && (
                <span id={errorId} className={styles.errorMessage} role="alert">
                    {error}
                </span>
            )}
        </div>
    );
}
