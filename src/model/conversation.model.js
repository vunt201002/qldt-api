import sequelize from '../database/connect.js';
import {DataTypes} from 'sequelize';
import typeConversationEnum from '../enumurator/typeConversation.enum.js';

const Conversation = sequelize.define(
  'Conversation',
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    type: {
      type: DataTypes.ENUM(...Object.values(typeConversationEnum)),
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: true, // Null for private conversations
    },
    lastMessageAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    timestamps: true,
  },
);

export default Conversation;
