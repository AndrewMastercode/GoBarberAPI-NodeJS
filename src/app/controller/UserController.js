import * as Yup from 'yup';

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

    const {
      id, name, email, provider,
    } = await User.create(req.body);

    return res.json(
      {
        id, name, email, provider,
      },
    );
  }

  async update(req, res) {
    const { email, oldPassword } = req.body;
    const user = await User.findByPk(req.userId);

    //  checar se houve alteracao no email do usuario
    if (email !== user.email) {
      const userExists = await User.findOne({
        where: { email },
      });

      //  se houve alteracao entao cheque se o email ja esta cadastrado com outra conta
      if (userExists) {
        return res.status(400).json({ error: 'User already exist' });
      }
    }

    //  se preencheu o campo de senha antiga entao verificar se ela bate com a do usuario
    if (oldPassword && !(await user.checkPassword(oldPassword))) {
      return res.status(401).json({ error: 'Password does not match' });
    }

    const { id, name, provider } = await user.update(req.body);

    return res.json({
      id, name, email, provider,
    });
  }
}

export default new UserController();
