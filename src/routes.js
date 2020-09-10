import { Router } from 'express';

import UserController from './app/controller/UserController';
import SessionController from './app/controller/SessionController';
import authMiddleware from './app/middleware/authMiddleware';

const routes = new Router();

routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);

//  rotas que exigem autenticacao
routes.use(authMiddleware);
routes.put('/users', UserController.update);

export default routes;
