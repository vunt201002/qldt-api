import sequelize from '../database/connect.js';
import {DataTypes} from 'sequelize';
import AccountModel from './account.model.js';
import typeNotificationEnum from '../enumurator/typeNotification.enum.js';

const Notification = sequelize.define(
  'Notification',
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
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM(...Object.values(typeNotificationEnum)),
      allowNull: false,
    },
    senderId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: AccountModel,
        key: 'id',
      },
    },
    recipientId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: AccountModel,
        key: 'id',
      },
    },
    relatedItemId: {
      type: DataTypes.UUID,
      allowNull: true,
      // Can reference various items based on type (class, assignment, etc.)
    },
    isRead: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    priority: {
      type: DataTypes.ENUM('LOW', 'MEDIUM', 'HIGH'),
      defaultValue: 'MEDIUM',
    },
  },
  {
    timestamps: true,
  },
);

export default Notification;
