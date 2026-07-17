import {extendZodWithOpenApi} from '@asteasolutions/zod-to-openapi';
import {z} from 'zod';

// Enable .openapi() on Zod schemas once for the whole backend.
extendZodWithOpenApi(z);

export {z};
