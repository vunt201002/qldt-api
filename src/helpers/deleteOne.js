import {getElementByField} from './getElementByField.js';

export async function deleteOne({model, id}) {
  const element = await getElementByField({model, field: 'id', value: id});

  if (!element) return null;

  return await model.destroy({
    where: {
      id: id,
    },
  });
}
