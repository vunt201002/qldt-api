import sequelize from '../database/connect.js';
import {DataTypes} from 'sequelize';
import typeMaterialEnum from '../enumurator/typeMaterial.enum.js';

const Material = sequelize.define(
  'Material',
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    fileUrl: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM(...Object.values(typeMaterialEnum)),
      defaultValues: typeMaterialEnum.READING,
      allowNull: true,
    },
  },
  {
    timestamps: true,
  },
);

export default Material;
