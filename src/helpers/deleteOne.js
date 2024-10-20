export async function deleteOne({model, id}) {
  return await model.destroy({
    where: {
      id: id,
    },
  });
}
