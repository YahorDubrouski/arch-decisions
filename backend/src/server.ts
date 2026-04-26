import {createApp} from './app.js';
import {getServerConfig} from './config/env.config.js';

const app = createApp();
const {port} = getServerConfig();

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
