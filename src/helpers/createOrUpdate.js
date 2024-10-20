// eslint-disable-next-line no-unused-vars
import {Model} from 'sequelize';

/**
 *
 * @param {typeof Model} model
 * @param {string} field
 * @param {any} value
 * @param {Object} data
 * @returns {Promise<{data: Promise<Model> | Promise<Model | null>, success: boolean, message: string}|{data: (*|Promise<Model>|Promise<Model | null>), success: boolean, message: string}>}
 */
export async function createOrUpdate({model, field, value, data}) {
  let element = await model.findOne({
    where: {
      [field]: value,
    },
  });

  if (element) {
    await element.update(data);
    return {
      success: true,
      message: 'Updated successfully.',
      data: element,
    };
  }

  element = await model.create(data);
  return {
    success: true,
    message: 'Created successfully',
    data: element,
  };
}
