import User from '../model/User';
import File from '../model/File';

class ProviderController {
  async index(req, res) {
    const providers = await User.findAll({
      where: { provider: true },
      attributes: ['id', 'name', 'email', 'avatar_id'],
      include: [{
        model: File,
        as: 'avatar',
      }],
    });

    return res.json(providers);
  }
}

export default new ProviderController();
