import { isBefore, subHours } from 'date-fns';

import Appointment from '../model/Appointment';
import User from '../model/User';

import Mail from '../../lib/Mail';

class DeleteAppointmentService {
  async run({ user_id, provider_id }) {
    const appointment = await Appointment.findByPk(provider_id, {
      include: [
        {
          model: User,
          as: 'provider',
          attributes: ['name', 'email'],
        },
        {
          model: User,
          as: 'user',
          attributes: ['name'],
        },
      ],
    });

    if (appointment.user_id !== user_id) {
      throw new Error('You dont have permission to cancel this appointment');
    }

    const dateOffset = subHours(appointment.date, 2);

    if (isBefore(dateOffset, new Date())) {
      throw new Error('You can only cancel appointments 2 hours in advance');
    }

    appointment.canceled_at = new Date();

    await appointment.save();
    await Mail.sendMail({
      to: `${appointment.provider.name} <${appointment.provider.email}>`,
      subject: 'Agendamento cancelado',
      text: 'O seu agendamento foi cancelamento',
    });

    return appointment;
  }
}

export default new DeleteAppointmentService();
