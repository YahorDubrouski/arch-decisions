import {TradeOffs} from '@/domain/recommendations';
import styles from './TradeOffsGrid.module.css';

interface TradeOffsGridProps {
    tradeOffs: TradeOffs;
}

const TRADE_OFF_FIELDS: Array<{key: keyof TradeOffs; label: string}> = [
    {key: 'cost', label: 'Cost'},
    {key: 'complexity', label: 'Complexity'},
    {key: 'risk', label: 'Risk'},
    {key: 'operationalOverhead', label: 'Ops overhead'},
];

export function TradeOffsGrid({tradeOffs}: TradeOffsGridProps) {
    return (
        <div className={styles.grid}>
            {TRADE_OFF_FIELDS.map(({key, label}) => (
                <div key={key} className={styles.item}>
                    <span className={styles.label}>{label}</span>
                    <span className={styles.value}>{tradeOffs[key]}</span>
                </div>
            ))}
        </div>
    );
}
