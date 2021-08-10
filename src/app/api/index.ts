import express, { json } from 'express';
import cors from 'cors';

import routes from './routes';

const api = express();

api.use(json());
api.use(cors());

api.use(routes);

export default api;