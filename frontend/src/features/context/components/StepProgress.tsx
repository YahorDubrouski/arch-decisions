import {ReactNode} from 'react';
import styles from './StepProgress.module.css';

type StepProgressProps = {
    currentStep: number;
    totalSteps: number;
    label: string;
};

export function StepProgress({currentStep, totalSteps, label}: StepProgressProps) {
    const progressPercent = (currentStep / totalSteps) * 100;

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <span className={styles.label}>{label}</span>
                <span className={styles.count}>
                    {currentStep} / {totalSteps}
                </span>
            </div>
            <div
                className={styles.track}
                role="progressbar"
                aria-valuenow={currentStep}
                aria-valuemin={1}
                aria-valuemax={totalSteps}
                aria-label={`Step ${currentStep} of ${totalSteps}`}
            >
                <span className={styles.fill} style={{width: `${progressPercent}%`}}/>
            </div>
        </div>
    );
}

export function StepProgressLegend({children}: {children: ReactNode}) {
    return <p className={styles.legend}>{children}</p>;
}
