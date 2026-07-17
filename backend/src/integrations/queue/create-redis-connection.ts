import {Redis} from 'ioredis';
import {getRedisConfig} from '@/config/redis.config.js';

export function createRedisConnection(): Redis {
    const {url} = getRedisConfig();
    return new Redis(url, {
        // Required by BullMQ: do not cap Redis command retries (workers need long-lived commands).
        // Example: maxRetriesPerRequest null → blocking BRPOP can wait forever; a small number would abort it.
        maxRetriesPerRequest: null,
    });
}
