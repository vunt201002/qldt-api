import NotificationModel from '../model/notification.model.js';
import {ValidationError, Op} from 'sequelize';
import {createOrUpdate} from '../helpers/createOrUpdate.js';
import typeSenderNotification from '../enumurator/typeSenderNotification.js';
import StudentModel from '../model/student.model.js';
import {getElementByField} from '../helpers/getElementByField.js';
import TeacherModel from '../model/teacher.model.js';
import {ForbiddenResponse, InvalidResponse, NotFoundResponse} from '../reponse/Error.js';
import {OkResponse} from '../reponse/Success.js';
import catchError from '../reponse/catchError.js';

export const createOrUpdateNotification = async (req, res) => {
  try {
    const {id} = req.params;
    const {recipientIds, ...rest} = req.body;
    const {senderId, senderType} = rest;

    if (senderType === typeSenderNotification.TEACHER) {
      if (!senderId)
        return InvalidResponse({
          res,
          message: 'Teacher notifications must include a senderId.',
        });

      const teacher = await getElementByField({
        model: TeacherModel,
        value: senderId,
        field: 'accountId',
      });

      if (!teacher)
        return NotFoundResponse({
          res,
          message: 'Teacher not found.',
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

    return OkResponse({
      res,
      data: notification,
    });
  } catch (err) {
    return catchError({
      res,
      err,
      message: 'Error during create or update notification',
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
      return NotFoundResponse({
        res,
        message: 'Student not found.',
      });
    }

    if (student.accountId !== req.user.id)
      return ForbiddenResponse({
        res,
      });

    const notifications = await student.getNotifications({
      order: [['createdAt', 'DESC']],
    });

    return OkResponse({
      res,
      message: 'Notifications fetched successfully.',
      data: notifications,
    });
  } catch (err) {
    return catchError({
      res,
      err,
      message: 'Error fetching notifications for student',
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
      return NotFoundResponse({
        res,
        message: 'Student not found.',
      });
    }
    if (student.accountId !== req.user.id)
      return ForbiddenResponse({
        res,
      });

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

    return OkResponse({
      res,
      message: '',
      data: validNotificationIds,
    });
  } catch (err) {
    return catchError({
      res,
      err,
      message: 'Error marking notifications as read',
    });
  }
};
