import { setupApi } from './app/api';

// FIXME - put on envs
const PORT = 3006;
const HOST = 'localhost';

setupApi()
  .then((app) => app.listen(PORT, () => {
    console.info(`Server is running at http://${HOST}:${PORT}`);
  })).catch((error) => {
    console.error(error);
    process.exit(1);
  });
