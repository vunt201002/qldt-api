export default async function getElementFields({model, fields}) {
  return await model.findAll({
    attributes: fields,
  });
}
