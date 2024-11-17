import AccountModel from '../model/account.model.js';
import NotificationModel from '../model/notification.model.js';
import {ValidationError} from 'sequelize';
import {getElementByField} from '../helpers/getElementByField.js';
import {createOrUpdate} from '../helpers/createOrUpdate.js';

export const createOrUpdateNotification = async (req, res) => {
  try {
    const {id} = req.params;
    const {senderId, recipientId} = req.body;

    if (senderId) {
      const senderExists = await getElementByField({
        model: AccountModel,
        value: senderId,
      });

      if (!senderExists) {
        return res.status(404).json({
          success: false,
          message: 'Sender does not exist.',
        });
      }
    }

    if (recipientId) {
      const recipientExists = await getElementByField({
        model: AccountModel,
        value: recipientId,
      });

      if (!recipientExists) {
        return res.status(404).json({
          success: false,
          message: 'Recipient does not exist.',
        });
      }
    }

    if (id) {
      const notification = await getElementByField({
        model: NotificationModel,
        value: id,
      });

      if (!notification) {
        return res.status(404).json({
          success: false,
          message: 'Notification not found.',
        });
      }
    }

    const resp = await createOrUpdate({
      model: NotificationModel,
      value: id || '',
      data: req.body,
    });

    return res.status(201).json(resp);
  } catch (err) {
    console.error(`Error during create or update notification:`, err);

    if (err instanceof ValidationError) {
      const errorMessages = err.errors.map((error) => error.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error.',
        errors: errorMessages,
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Internal server error.',
    });
  }
};
