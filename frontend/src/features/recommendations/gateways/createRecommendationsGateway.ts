import {getDataSource} from '@/shared/config/dataSource';
import {createHttpRecommendationsGateway} from './HttpRecommendationsGateway';
import {createLocalRecommendationsGateway} from './LocalRecommendationsGateway';
import type {RecommendationsGateway} from './recommendationsGateway.port';

/**
 * Chooses the recommendations adapter from `VITE_DATA_SOURCE`.
 */
export function createRecommendationsGateway(): RecommendationsGateway {
    const dataSource = getDataSource();

    switch (dataSource) {
        case 'http':
            return createHttpRecommendationsGateway();
        case 'local':
            return createLocalRecommendationsGateway();
        default: {
            const exhaustiveCheck: never = dataSource;
            throw new Error(`Unsupported data source: ${String(exhaustiveCheck)}`);
        }
    }
}
