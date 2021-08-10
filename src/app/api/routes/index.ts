import { Router } from 'express';

import helloWorld from './hello-world.routes';

const routes = Router();

routes.get('/hello', helloWorld);

export default routes;
