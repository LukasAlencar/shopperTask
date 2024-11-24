import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('shopper', 'postgres', 'postgres', {
  host: 'localhost',
  dialect: 'postgres',
  logging: false,      
});

export default sequelize;
