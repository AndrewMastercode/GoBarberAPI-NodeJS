import Appointment from '../model/Appointment';
import User from '../model/User';
import File from '../model/File';

import CreateAppointmentService from '../service/CreateAppointmentService';
import DeleteAppointmentService from '../service/DeleteAppointmentService';

import Cache from '../../lib/Cache';

class AppointmentController {
  async index(req, res) {
    const { page = 1 } = req.query;

    /* separar o cache através de um key composta, para nao sobreescrever
      os dados usando apenas um caminho */
    const cacheKey = `user:${req.userId}:appointments:${page}`;

    const cached = await Cache.get(cacheKey);

    if (cached) {
      return res.json(cached);
    }

    const appointments = await Appointment.findAll({
      where: { user_id: req.userId, canceled_at: null },
      order: ['date'],
      limit: 20, //  limite de resultado para retornar
      offset: (page - 1) * 20,
      attributes: ['id', 'date', 'past', 'cancelable'],
      include: [{
        model: User,
        as: 'provider',
        attributes: ['id', 'name'],
        include: [{
          model: File,
          as: 'avatar',
          attributes: ['id', 'path', 'url'],
        }],
      }],
    });

    await Cache.set(cacheKey, appointments);

    return res.json(appointments);
  }

  async store(req, res) {
    try {
      const { provider_id, date } = req.body;

      const appointment = await CreateAppointmentService.run(
        { provider_id, user_id: req.userId, date },
      );

      await Cache.invalidatePrefix(`user:${req.userId}:appointments`);

      return res.json(appointment);
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  }

  async delete(req, res) {
    try {
      const appointment = await DeleteAppointmentService.run(
        { user_id: req.userId, provider_id: req.params.id },
      );

      await Cache.invalidatePrefix(`user:${req.userId}:appointments`);

      return res.json(appointment);
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  }
}

export default new AppointmentController();
