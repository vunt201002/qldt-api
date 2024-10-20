import sequelize from '../database/connect.js';
import {DataTypes} from 'sequelize';
import statusRequestEnum from '../enumurator/statusRequest.enum.js';

const AbsenceRequest = sequelize.define(
  'AbsenceRequest',
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    reason: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM(...Object.values(statusRequestEnum)),
      defaultValue: statusRequestEnum.PENDING,
    },
    requestDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    responseDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    timestamps: true,
  },
);

export default AbsenceRequest;
