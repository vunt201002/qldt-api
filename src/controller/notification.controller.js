import NotificationModel from '../model/notification.model.js';
import {ValidationError} from 'sequelize';
import {createOrUpdate} from '../helpers/createOrUpdate.js';
import typeSenderNotification from '../enumurator/typeSenderNotification.js';
import StudentModel from '../model/student.model.js';
import {getElementByField} from '../helpers/getElementByField.js';
import TeacherModel from '../model/teacher.model.js';

export const createOrUpdateNotification = async (req, res) => {
  try {
    const {id} = req.params;
    const {recipientIds, ...rest} = req.body;
    const {senderId, senderType} = rest;

    if (senderType === typeSenderNotification.TEACHER) {
      if (!senderId)
        return res.status(400).json({
          success: false,
          message: 'Teacher notifications must include a senderId.',
        });

      const teacher = await getElementByField({
        model: TeacherModel,
        value: senderId,
      });

      if (!teacher)
        return res.status(400).json({
          success: false,
          message: 'Teacher not found.',
        });
    }

    if (senderType === 'SYSTEM' && senderId) {
      return res.status(400).json({
        success: false,
        message: 'System notifications should not have a senderId.',
      });
    }

    const resp = await createOrUpdate({
      model: NotificationModel,
      value: id || '',
      data: rest,
    });

    const {data: notification} = resp;

    let validRecipientIds = [];
    if (recipientIds && Array.isArray(recipientIds)) {
      const validStudents = await StudentModel.findAll({
        where: {id: recipientIds},
        attributes: ['id'],
      });

      validRecipientIds = validStudents.map((student) => student.id);

      if (notification) {
        await notification.setStudents(validRecipientIds);
      }
    }

    return res.status(201).json(resp);
  } catch (err) {
    console.error(`Error during create or update notification:`, err);

    if (err instanceof ValidationError) {
      const errorMessages = err.errors.map((error) => error.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errorMessages,
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Internal server error.',
    });
  }
};
