import {describe, expect, it} from 'vitest';
import {calculateTradeOffs} from '../calculateTradeOffs';

describe('calculateTradeOffs', () => {
    /**
     * Given
     * - A known compute option with predefined trade-off levels.
     * When
     * - Trade-offs are calculated for that option.
     * Then
     * - The configured trade-off profile is returned.
     */
    it('returns known option trade-offs', () => {
        // Arrange
        const category = 'compute';
        const option = 'Lambda';

        // Act
        const tradeOffs = calculateTradeOffs(category, option);

        // Assert
        expect(tradeOffs).toEqual({
            cost: 'low',
            complexity: 'medium',
            risk: 'low',
            operationalOverhead: 'low',
        });
    });

    /**
     * Given
     * - An unknown option name.
     * When
     * - Trade-offs are calculated for that option.
     * Then
     * - Medium levels are used as a safe default.
     */
    it('falls back to medium levels for unknown options', () => {
        // Arrange
        const category = 'compute';
        const option = 'Unknown';

        // Act
        const tradeOffs = calculateTradeOffs(category, option);

        // Assert
        expect(tradeOffs).toEqual({
            cost: 'medium',
            complexity: 'medium',
            risk: 'medium',
            operationalOverhead: 'medium',
        });
    });
});
