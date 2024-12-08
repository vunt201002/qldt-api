import sequelize from '../database/connect.js';
import {DataTypes} from 'sequelize';
import typeNotificationEnum from '../enumurator/typeNotification.enum.js';
import notificationPriorityEnum from '../enumurator/notificationPriority.enum.js';
import typeSenderNotificationEnum from '../enumurator/typeSenderNotification.js';

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
      defaultValue: '',
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: '',
    },
    type: {
      type: DataTypes.ENUM(...Object.values(typeNotificationEnum)),
      allowNull: false,
      defaultValue: typeNotificationEnum.SYSTEM,
    },
    senderId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    senderType: {
      type: DataTypes.ENUM(...Object.values(typeSenderNotificationEnum)),
      allowNull: false,
      defaultValue: typeSenderNotificationEnum.SYSTEM,
    },
    relatedItemId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    isRead: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      defaultView: false,
    },
    priority: {
      type: DataTypes.ENUM(...Object.values(notificationPriorityEnum)),
      allowNull: true,
      defaultValue: notificationPriorityEnum.MEDIUM,
    },
  },
  {
    timestamps: true,
  },
);

export default Notification;
