import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

import UserController from './app/controller/UserController';
import SessionController from './app/controller/SessionController';
import authMiddleware from './app/middleware/authMiddleware';
import FileController from './app/controller/FileController';
import ProviderController from './app/controller/ProviderController';

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);

//  rotas que exigem autenticacao
routes.use(authMiddleware);
routes.get('/providers', ProviderController.index);
routes.put('/users', UserController.update);
routes.post('/files', upload.single('file'), FileController.store);

export default routes;
