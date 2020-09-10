import User from '../model/User';

class UserController {
  async store(req, res) {
    const userExists = await User.findOne(
      {
        where: { email: req.body.email },
      },
    );

    if (userExists) {
      return res.status(400).json({ error: 'User already exist.' });
    }

    const { name, email, provider } = await User.create(req.body);

    return res.json(
      {
        name, email, provider,
      },
    );
  }

  async update(req, res) {
    return res.json({ ok: true });
  }
}

export default new UserController();
