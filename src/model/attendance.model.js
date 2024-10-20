import sequelize from '../database/connect.js';
import {DataTypes} from 'sequelize';
import statusAttendanceEnum from '../enumurator/statusAttendance.enum.js';

const Attendance = sequelize.define(
  'Attendance',
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM(...Object.values(statusAttendanceEnum)),
      defaultValue: statusAttendanceEnum.PRESENT,
      allowNull: false,
    },
    timestamp: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    timestamps: true,
  },
);

export default Attendance;
