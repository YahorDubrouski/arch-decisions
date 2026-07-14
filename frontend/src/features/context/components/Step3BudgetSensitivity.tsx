import {ProjectContext} from '@/domain/context';
import styles from './Step3BudgetSensitivity.module.css';

interface Step3BudgetSensitivityProps {
    value: ProjectContext['budgetSensitivity'] | null;
    onChange: (value: ProjectContext['budgetSensitivity']) => void;
    error?: string;
}

export function Step3BudgetSensitivity({value, onChange, error}: Step3BudgetSensitivityProps) {
    const selectClassName = error ? `${styles.select} ${styles.selectError}` : styles.select;
    const errorId = 'budget-sensitivity-error';

    return (
        <div className={styles.container}>
            <label htmlFor="budget-sensitivity">Budget Sensitivity</label>
            <select
                id="budget-sensitivity"
                value={value ?? ''}
                onChange={(event) => onChange(event.target.value as ProjectContext['budgetSensitivity'])}
                className={selectClassName}
                aria-invalid={error ? true : undefined}
                aria-describedby={error ? errorId : undefined}
            >
                <option value="">Select budget priority</option>
                <option value="cost-optimized">Cost optimized</option>
                <option value="balanced">Balanced</option>
                <option value="performance-first">Performance first</option>
            </select>
            {error && (
                <span id={errorId} className={styles.errorMessage} role="alert">
                    {error}
                </span>
            )}
        </div>
    );
}
