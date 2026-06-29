import {ProjectContext} from '@/domain/context';
import styles from './Step1TeamSize.module.css';

interface Step1TeamSizeProps {
    value: ProjectContext['teamSize'] | null;
    onChange: (value: ProjectContext['teamSize']) => void;
    error?: string;
}

export function Step1TeamSize({value, onChange, error}: Step1TeamSizeProps) {
    const selectClassName = error ? `${styles.select} ${styles.selectError}` : styles.select;
    const errorId = 'team-size-error';

    return (
        <div className={styles.container}>
            <label htmlFor="team-size">Team Size</label>
            <select
                id="team-size"
                value={value ?? ''}
                onChange={(event) => onChange(event.target.value as ProjectContext['teamSize'])}
                className={selectClassName}
                aria-invalid={error ? true : undefined}
                aria-describedby={error ? errorId : undefined}
            >
                <option value="">Select team size</option>
                <option value="1-5">1-5 people</option>
                <option value="6-20">6-20 people</option>
                <option value="21-50">21-50 people</option>
                <option value="50+">50+ people</option>
            </select>
            {error && (
                <span id={errorId} className={styles.errorMessage} role="alert">
                    {error}
                </span>
            )}
        </div>
    );
}
