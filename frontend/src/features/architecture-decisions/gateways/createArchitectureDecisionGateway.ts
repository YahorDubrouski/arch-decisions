import {getDataSource} from '@/shared/config/dataSource';
import {createHttpArchitectureDecisionGateway} from './HttpArchitectureDecisionGateway';
import {createLocalArchitectureDecisionGateway} from './LocalArchitectureDecisionGateway';
import type {ArchitectureDecisionGateway} from './architectureDecisionGateway.port';

/**
 * Chooses the architecture-decision adapter from `VITE_DATA_SOURCE`.
 */
export function createArchitectureDecisionGateway(): ArchitectureDecisionGateway {
    const dataSource = getDataSource();

    switch (dataSource) {
        case 'http':
            return createHttpArchitectureDecisionGateway();
        case 'local':
            return createLocalArchitectureDecisionGateway();
        default: {
            const exhaustiveCheck: never = dataSource;
            throw new Error(`Unsupported data source: ${String(exhaustiveCheck)}`);
        }
    }
}
