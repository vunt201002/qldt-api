import sequelize from '../database/connect.js';
import {DataTypes} from 'sequelize';
import RoleEnum from '../enumurator/role.enum.js';
import statusAccountEnum from '../enumurator/statusAccount.enum.js';
import {basePersonModelField} from '../constant/baseModelField.js';

const account = sequelize.define('account', {
  ...basePersonModelField,
  passwordHash: {
    type: DataTypes.STRING,
    defaultValue: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM,
    defaultValue: RoleEnum.STUDENT,
    allowNull: false,
  },
  token: {
    type: DataTypes.STRING,
    defaultValue: DataTypes.STRING,
    allowNull: true,
  },
  session: {
    type: DataTypes.STRING,
    defaultValue: DataTypes.STRING,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM,
    defaultValue: statusAccountEnum.ACTIVE,
    allowNull: false,
  },
});

export default account;
