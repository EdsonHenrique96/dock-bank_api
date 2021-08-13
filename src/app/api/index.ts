import express, {
  Express,
  json,
} from 'express';
import cors from 'cors';

import { setupDb, initSchema } from './helpers/setupDatabase';

import accountRoutes from './routes/account.routes';
import userRoutes from './routes/user.routes';

import errorHandler from './middlewares/error-handler-middleware';

export const setupApi = async (): Promise<Express> => {
  const api = express();

  try {
    await setupDb();
  } catch (error) {
    console.error(`fails to configure database connection: ${error.message}`);
    process.exit(1);
  }

  try {
    await initSchema();
  } catch (error) {
    console.error(`Failed to start database schema: ${error.message}`);
    process.exit(1);
  }

  api.use(json());
  api.use(cors());

  api.use(accountRoutes);
  api.use(userRoutes);

  api.use(errorHandler);

  return api;
};
