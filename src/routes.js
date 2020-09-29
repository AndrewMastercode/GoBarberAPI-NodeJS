import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

import UserController from './app/controller/UserController';
import SessionController from './app/controller/SessionController';
import authMiddleware from './app/middleware/authMiddleware';
import FileController from './app/controller/FileController';
import ProviderController from './app/controller/ProviderController';
import AppointmentController from './app/controller/AppointmentController';
import ScheduleController from './app/controller/ScheduleController';
import NotificationController from './app/controller/NotificationController';

import validateUserStore from './app/validator/UserStore';
import validateUserUpdate from './app/validator/UserUpdate';
import validateSessionStore from './app/validator/SessionStore';
import validateAppointmentStore from './app/validator/AppointmentStore';
import AvailableController from './app/controller/AvailableController';

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/users', validateUserStore, UserController.store);
routes.post('/sessions', validateSessionStore, SessionController.store);

//  rotas que exigem autenticacao
routes.use(authMiddleware);
routes.get('/providers', ProviderController.index);
routes.get('/providers/:provider_id/available', AvailableController.index);
routes.put('/users', validateUserUpdate, UserController.update);
routes.get('/appointments', AppointmentController.index);
routes.post('/appointments', validateAppointmentStore, AppointmentController.store);
routes.delete('/appointments/:id', AppointmentController.delete);
routes.get('/schedules', ScheduleController.index);
routes.get('/notifications', NotificationController.index);
routes.put('/notifications/:id', NotificationController.update);
routes.post('/files', upload.single('file'), FileController.store);

export default routes;
