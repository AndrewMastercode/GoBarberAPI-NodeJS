import Sequelize, { Model } from 'sequelize';
import bcrypt from 'bcryptjs';

class User extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        password_decrypted: Sequelize.VIRTUAL,
        password: Sequelize.STRING,
        provider: Sequelize.BOOLEAN,
      },
      {
        sequelize,
      },
    );

    this.addHook('beforeSave', async (user) => {
      if (user.password_decrypted) {
        user.password = await bcrypt.hash(user.password_decrypted, 8);
      }
    });

    return this;
  }

  static associate(models) {
    this.belongsTo(models.File, { foreignKey: 'avatar_id', as: 'avatar' });
  }

  checkPassword(password_decrypted) {
    return bcrypt.compare(password_decrypted, this.password);
  }
}

export default User;
