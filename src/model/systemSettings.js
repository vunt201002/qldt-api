import sequelize from '../database/connect.js';
import {DataTypes} from 'sequelize';
import AccountModel from './account.model.js';

const SystemSettings = sequelize.define(
  'SystemSettings',
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    key: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    value: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    lastUpdatedBy: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: AccountModel,
        key: 'id',
      },
    },
  },
  {
    timestamps: true,
  },
);

export default SystemSettings;
