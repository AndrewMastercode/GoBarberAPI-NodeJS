import Notification from '../schema/Notification';
import User from '../model/User';

class NotificationController {
  async index(req, res) {
    const isProvider = await User.findOne({
      where: { id: req.userId, provider: true },
    });

    if (!isProvider) {
      return res.status(401).json({ error: 'YOnly provider can load notifications' });
    }

    const notifications = await Notification.find({
      user: req.userId,
    }).sort({ createdAt: 'desc' }).limit(10);

    return res.json(notifications);
  }
}

export default new NotificationController();
