import sequelize from '../database/connect.js';
import {DataTypes} from 'sequelize';
import AccountModel from './account.model.js';
import ConversationModel from './conversation.model.js';
import typeMessageEnum from '../enumurator/typeMessage.enum.js';

const Message = sequelize.define(
  'Message',
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    conversationId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: ConversationModel,
        key: 'id',
      },
    },
    senderId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: AccountModel,
        key: 'id',
      },
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM(...Object.values(typeMessageEnum)),
      defaultValue: typeMessageEnum.TEXT,
    },
    fileUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    isDeleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    timestamps: true,
  },
);

export default Message;
