// eslint-disable-next-line no-unused-vars
import {Model} from 'sequelize';

/**
 *
 * @param {typeof Model} model
 * @returns {Promise<*>}
 */
export default async function getAll({model}) {
  return await model.findAll();
}
