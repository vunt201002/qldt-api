import {DataTypes} from 'sequelize';

export const baseModelField = {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false,
  },
};

export const basePersonModelField = {
  ...baseModelField,
  name: {
    type: DataTypes.STRING,
    defaultValue: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    defaultValue: DataTypes.STRING,
    allowNull: false,
  },
  classes: {
    type: DataTypes.ARRAY,
    defaultValue: DataTypes.STRING,
    allowNull: false,
  },
  exercises: {
    type: DataTypes.ARRAY,
    defaultValue: DataTypes.ARRAY,
    allowNull: false,
  },
  timetable: {
    type: DataTypes.ARRAY,
    defaultValue: DataTypes.ARRAY,
    allowNull: false,
  },
};
