import api from './app/api';

// FIXME - put on envs
const PORT = 3006;
const HOST = 'localhost';

api.listen(PORT, () => {
  console.info(`Server is running at http://${HOST}:${PORT}`);
});
