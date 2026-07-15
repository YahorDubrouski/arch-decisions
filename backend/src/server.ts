import {createApp} from './app.js';
import {bootstrapSqliteStorage} from './integrations/storage/bootstrap-sqlite-storage.js';
import {getServerConfig} from './config/env.config.js';

async function startServer(): Promise<void> {
    await bootstrapSqliteStorage();

    const app = createApp();
    const {port} = getServerConfig();

    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
}

void startServer();
