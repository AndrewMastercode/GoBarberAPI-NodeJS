module.exports = {
  up: async (queryInterface, Sequelize) => queryInterface.addColumn('users', 'avatar_id', {
    type: Sequelize.INTEGER,
    references: { model: 'files', ikey: 'id' },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL',
    allowNull: true,
  }),

  down: async (queryInterface) => queryInterface.removeColumn('users', 'avatar_id'),
};
