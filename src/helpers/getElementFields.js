export default async function getElementFields({model, fields, field, value}) {
  return await model.findAll({
    include: {
      model: model,
      where: {
        [field]: value,
      },
    },
    attributes: fields,
  });
}
