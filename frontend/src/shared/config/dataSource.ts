export type DataSource = 'http' | 'local';

const DATA_SOURCES = new Set<DataSource>(['http', 'local']);

/**
 * Selects where feature gateways read/write data.
 * Default `http` keeps current Express behaviour until Local adapters land.
 */
export function getDataSource(): DataSource {
    const configured = import.meta.env.VITE_DATA_SOURCE?.toLowerCase();

    if (configured && DATA_SOURCES.has(configured as DataSource)) {
        return configured as DataSource;
    }

    return 'http';
}
