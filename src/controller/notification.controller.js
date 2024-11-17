import NotificationModel from '../model/notification.model.js';
import {ValidationError, Op} from 'sequelize';
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

export const getStudentNotifications = async (req, res) => {
  try {
    const {studentId} = req.params;

    const student = await getElementByField({
      model: StudentModel,
      value: studentId,
    });
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found.',
      });
    }

    const notifications = await student.getNotifications({
      order: [['createdAt', 'DESC']],
    });

    return res.status(200).json({
      success: true,
      message: 'Notifications fetched successfully.',
      data: notifications,
    });
  } catch (err) {
    console.error(`Error fetching notifications for student:`, err);

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

export const markNotificationsAsRead = async (req, res) => {
  try {
    const {studentId} = req.params;
    const {notificationIds} = req.body;

    const student = await getElementByField({
      model: StudentModel,
      value: studentId,
    });
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found.',
      });
    }

    const notifications = await NotificationModel.findAll({
      where: {
        id: notificationIds,
      },
    });

    const validNotificationIds = notifications.map((notification) => notification.id);

    await NotificationModel.update(
      {isRead: true},
      {
        where: {
          id: {[Op.in]: validNotificationIds},
        },
      },
    );

    return res.status(200).json({
      success: true,
      message: 'Notifications marked as read successfully.',
      data: validNotificationIds,
    });
  } catch (err) {
    console.error(`Error marking notifications as read:`, err);

    return res.status(500).json({
      success: false,
      message: 'Internal server error.',
    });
  }
};
