module.exports = {
  dialect: 'postgres',
  host: 'localhost',
  username: 'postgres',
  password: 'pg123',
  database: 'gobarber',
  define: {
    timestamps: true,
    underscored: true, //  textoExemplo => texto_exemplo
    underscoredAll: true,
  },
};
