// Define relationships
import TeacherModel from './teacher.model.js';
import StudentModel from './student.model.js';
import AccountModel from './account.model.js';
import ClassModel from './class.model.js';
import AbsenceRequestModel from './absenceRequest.model.js';
import AttendanceModel from './attendance.model.js';
import MaterialModel from './material.model.js';
import SurveyModel from './survey.model.js';
import SurveyResponseModel from './surveyResponse.model.js';
import ConversationModel from './conversation.model.js';
import MessageModel from './message.model.js';
import SystemSettings from './systemSettings.js';
import NotificationModel from './notification.model.js';

export const setupAssociations = () => {
  // Teacher associations
  TeacherModel.belongsTo(AccountModel, {foreignKey: {name: 'accountId', allowNull: false}});
  TeacherModel.hasMany(ClassModel, {foreignKey: 'teacherId', onDelete: 'CASCADE'});

  // Student associations
  StudentModel.belongsTo(AccountModel, {foreignKey: 'accountId'});
  StudentModel.belongsToMany(ClassModel, {
    through: 'StudentClasses',
    foreignKey: 'studentId',
    otherKey: 'classId',
    onDelete: 'CASCADE',
  });
  StudentModel.hasMany(AbsenceRequestModel, {foreignKey: 'studentId', onDelete: 'CASCADE'});
  StudentModel.hasMany(AttendanceModel, {foreignKey: 'studentId', onDelete: 'CASCADE'});

  // Class associations
  ClassModel.belongsTo(TeacherModel, {foreignKey: 'teacherId'});
  ClassModel.belongsToMany(StudentModel, {
    through: 'StudentClasses',
    foreignKey: 'classId',
    otherKey: 'studentId',
    onDelete: 'CASCADE',
  });
  ClassModel.hasMany(AttendanceModel, {foreignKey: 'classId', onDelete: 'CASCADE'});
  ClassModel.hasMany(MaterialModel, {foreignKey: 'classId', onDelete: 'CASCADE'});
  ClassModel.hasMany(SurveyModel, {foreignKey: 'classId', onDelete: 'CASCADE'});

  // Attendance associations
  AttendanceModel.belongsTo(ClassModel, {foreignKey: 'classId'});
  AttendanceModel.belongsTo(StudentModel, {foreignKey: 'studentId'});

  // Material associations
  MaterialModel.belongsTo(ClassModel, {foreignKey: 'classId'});

  // AbsenceRequest associations
  AbsenceRequestModel.belongsTo(StudentModel, {foreignKey: 'studentId'});
  AbsenceRequestModel.belongsTo(ClassModel, {foreignKey: 'classId'});

  // Survey associations
  SurveyModel.belongsTo(ClassModel, {foreignKey: 'classId'});
  SurveyModel.hasMany(SurveyResponseModel, {foreignKey: 'surveyId', onDelete: 'CASCADE'});

  // SurveyResponse associations
  SurveyResponseModel.belongsTo(SurveyModel, {foreignKey: 'surveyId'});
  SurveyResponseModel.belongsTo(StudentModel, {foreignKey: 'studentId'});

  // Notification associations
  NotificationModel.belongsTo(AccountModel, {
    as: 'sender',
    foreignKey: 'senderId',
  });

  NotificationModel.belongsToMany(StudentModel, {
    through: 'NotificationStudents',
    as: 'students',
    foreignKey: 'notificationId',
    otherKey: 'studentId',
  });

  StudentModel.belongsToMany(NotificationModel, {
    through: 'NotificationStudents',
    as: 'notifications',
    foreignKey: 'studentId',
    otherKey: 'notificationId',
  });

  // Conversation associations
  ConversationModel.belongsToMany(AccountModel, {
    through: 'ConversationParticipants',
    foreignKey: 'conversationId',
    otherKey: 'accountId',
    onDelete: 'CASCADE',
  });
  ConversationModel.hasMany(MessageModel, {foreignKey: 'conversationId', onDelete: 'CASCADE'});

  // Message associations
  MessageModel.belongsTo(ConversationModel, {foreignKey: 'conversationId'});
  MessageModel.belongsTo(AccountModel, {
    as: 'sender',
    foreignKey: 'senderId',
  });

  // SystemSettings associations
  SystemSettings.belongsTo(AccountModel, {
    as: 'lastUpdatedByUser',
    foreignKey: 'lastUpdatedBy',
  });

  console.log(`Set up association done`);
};
