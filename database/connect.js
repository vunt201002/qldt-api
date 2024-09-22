import {Sequelize} from 'sequelize';
import dbConfig from '../config/db.config.js';

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: false,
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle,
  },
});

export async function connect() {
  try {
    await sequelize.authenticate();
    console.log('Connected to db');
  } catch (err) {
    console.log('Error when connecting to db:', err);
  }
}

export async function reSync() {
  try {
    await sequelize.sync({force: false});
    console.log('Re-sync done');
  } catch (err) {
    console.log('Error during re-sync:', err);
  }
}

export default sequelize;
