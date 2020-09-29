import User from '../model/User';

import Cache from '../../lib/Cache';

class UserController {
  async store(req, res) {
    const userExists = await User.findOne({ where: { email: req.body.email } });

    if (userExists) {
      return res.status(400).json({ error: 'User already exist.' });
    }

    const {
      id, name, email, provider,
    } = await User.create(req.body);

    /* sempre que adicionar um novo provedor ao banco de dados
        deve-se limpar o cache para que a proxima requisição
        da lista de provedores devolva esse novo provedor */
    if (provider) {
      await Cache.invalidate('providers');
    }

    return res.json({
      id, name, email, provider,
    });
  }

  async update(req, res) {
    const { email, old_password } = req.body;
    const user = await User.findByPk(req.userId);

    //  checar se houve alteracao no email do usuario
    if (email && email !== user.email) {
      const userExists = await User.findOne({
        where: { email },
      });

      //  se houve alteracao entao cheque se o email ja esta cadastrado com outra conta
      if (userExists) {
        return res.status(400).json({ error: 'User already exist' });
      }
    }

    //  se preencheu o campo de senha antiga entao verificar se ela bate com a do usuario
    if (old_password && !(await user.checkPassword(old_password))) {
      return res.status(401).json({ error: 'Password does not match with user password' });
    }

    const { id, name, provider } = await user.update(req.body);

    return res.json({
      id, name, email, provider,
    });
  }
}

export default new UserController();
