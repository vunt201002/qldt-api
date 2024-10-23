import {Sequelize} from 'sequelize';
import dbConfig from '../config/db.config.js';

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle,
  },
});

export function connect() {
  sequelize
    .authenticate()
    .then(() => {
      console.log('Connected to db');
    })
    .catch((err) => {
      console.log(`Error when connect to db`, err);
    });
}

export function reSync() {
  sequelize
    .sync({force: false, alter: true})
    .then(() => {
      console.log(`Re-sync done`);
    })
    .catch((err) => {
      console.log(`Error when re-sync`, err);
    });
}

export default sequelize;
