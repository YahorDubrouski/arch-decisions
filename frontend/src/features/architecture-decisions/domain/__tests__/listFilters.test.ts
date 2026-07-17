import {describe, expect, it} from 'vitest';
import {paginateItems} from '@/features/architecture-decisions/domain/listFilters';

describe('paginateItems', () => {
    const items = Array.from({length: 16}, (_, index) => index + 1);

    /**
     * Given
     * - Sixteen items and page size five.
     * When
     * - The first page is requested.
     * Then
     * - The first five items and pagination metadata are returned.
     */
    it('returns the first page of items', () => {
        // Arrange
        const page = 1;
        const pageSize = 5;

        // Act
        const result = paginateItems(items, page, pageSize);

        // Assert
        expect(result).toEqual({
            pageItems: [1, 2, 3, 4, 5],
            total: 16,
            totalPages: 4,
            page: 1,
        });
    });

    /**
     * Given
     * - Sixteen items and a page number beyond the last page.
     * When
     * - Pagination is requested for that page.
     * Then
     * - Results are clamped to the last page.
     */
    it('clamps an out-of-range page to the last page', () => {
        // Arrange
        const outOfRangePage = 99;
        const pageSize = 5;

        // Act
        const result = paginateItems(items, outOfRangePage, pageSize);

        // Assert
        expect(result).toEqual({
            pageItems: [16],
            total: 16,
            totalPages: 4,
            page: 4,
        });
    });
});
