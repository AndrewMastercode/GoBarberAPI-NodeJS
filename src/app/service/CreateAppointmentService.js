import {
  startOfHour, parseISO, isBefore, format,
} from 'date-fns';
import pt from 'date-fns/locale/pt';

import Appointment from '../model/Appointment';
import User from '../model/User';
import Notification from '../schema/Notification';

class CreateAppointmentService {
  async run({ provider_id, user_id, date }) {
    const isProvider = await User.findOne({
      where: { id: provider_id, provider: true },
    });

    if (!isProvider) {
      throw new Error('You can only create appointments with providers');
    }

    const hourStart = startOfHour(parseISO(date));

    if (isBefore(hourStart, new Date())) {
      throw new Error('Past dates are not permitted');
    }

    const checkAvailability = await Appointment.findOne({
      where: {
        provider_id,
        canceled_at: null,
        date: hourStart,
      },
    });

    if (checkAvailability) {
      throw new Error('Appoitment date is not available');
    }

    if (user_id === provider_id) {
      throw new Error('You cannot schedule with yourself');
    }

    const appointment = await Appointment.create({
      user_id,
      provider_id,
      date,
    });

    //  notificacoes para o provedor
    const user = await User.findByPk(user_id);
    const formatedDate = format(
      hourStart,
      "dd 'de' MMMM', às' H:mm'h'",
      { locale: pt },
    );

    await Notification.create({
      content: `Novo agendamento de ${user.name} para o dia ${formatedDate}`,
      user: provider_id,
    });

    return appointment;
  }
}

export default new CreateAppointmentService();
