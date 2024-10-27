export function getModelRequiredField(model) {
  return Object.entries(model.rawAttributes)
    .filter(([key, attribute]) => key !== 'id' && !attribute.allowNull && !attribute._autoGenerated)
    .map(([key]) => key);
}
