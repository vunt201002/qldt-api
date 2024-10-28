// eslint-disable-next-line no-unused-vars
import {Model} from 'sequelize';

/**
 *
 * @param {typeof Model} model
 * @param {string} field
 * @param {any} value
 * @returns {Promise<Model|null>}
 */
export async function getElementByField({model, field = 'id', value}) {
  return model.findOne({
    where: {
      [field]: value,
    },
  });
}
