// Define relationships
import TeacherModel from './teacher.model.js';
import StudentModel from './student.model.js';
import AccountModel from './account.model.js';
import ClassModel from './class.model.js';
import AssignmentModel from './assignment.model.js';
import AbsenceRequestModel from './absenceRequest.model.js';
import AttendanceModel from './attendance.model.js';
import MaterialModel from './material.model.js';
import SurveyModel from './survey.model.js';
import SurveyResponseModel from './surveyResponse.model.js';
import ConversationModel from './conversation.model.js';
import MessageModel from './message.model.js';
import SystemSettings from './systemSettings.js';
import NotificationModel from './notification.model.js';
import StudentAssignmentsModel from './studentAssignments.model.js';

export const setupAssociations = () => {
  // Account associations
  AccountModel.hasOne(TeacherModel, {foreignKey: 'accountId', onDelete: 'CASCADE'});
  AccountModel.hasOne(StudentModel, {foreignKey: 'accountId', onDelete: 'CASCADE'});

  // Teacher associations
  TeacherModel.belongsTo(AccountModel, {foreignKey: 'accountId'});
  TeacherModel.hasMany(ClassModel, {foreignKey: 'teacherId', onDelete: 'CASCADE'});
  TeacherModel.hasMany(AssignmentModel, {foreignKey: 'teacherId', onDelete: 'CASCADE'});

  // Student associations
  StudentModel.belongsTo(AccountModel, {foreignKey: 'accountId'});
  StudentModel.belongsToMany(ClassModel, {
    through: 'StudentClasses', // Sequelize will create this table automatically
    foreignKey: 'studentId',
    otherKey: 'classId',
    onDelete: 'CASCADE',
  });
  StudentModel.hasMany(AbsenceRequestModel, {foreignKey: 'studentId', onDelete: 'CASCADE'});

  // Class associations
  ClassModel.belongsTo(TeacherModel, {foreignKey: 'teacherId'});
  ClassModel.belongsToMany(StudentModel, {
    through: 'StudentClasses', // Same table name as above
    foreignKey: 'classId',
    otherKey: 'studentId',
    onDelete: 'CASCADE',
  });
  ClassModel.hasMany(AssignmentModel, {foreignKey: 'classId', onDelete: 'CASCADE'});
  ClassModel.hasMany(AttendanceModel, {foreignKey: 'classId', onDelete: 'CASCADE'});
  ClassModel.hasMany(MaterialModel, {foreignKey: 'classId', onDelete: 'CASCADE'});
  ClassModel.hasMany(SurveyModel, {foreignKey: 'classId', onDelete: 'CASCADE'});

  // Assignment associations
  AssignmentModel.belongsTo(ClassModel, {foreignKey: 'classId'});
  AssignmentModel.belongsTo(TeacherModel, {foreignKey: 'teacherId'});
  AssignmentModel.belongsToMany(StudentModel, {
    through: StudentAssignmentsModel,
    foreignKey: 'assignmentId',
    otherKey: 'studentId',
    onDelete: 'CASCADE',
  });

  StudentModel.belongsToMany(AssignmentModel, {
    through: StudentAssignmentsModel,
    foreignKey: 'studentId',
    otherKey: 'assignmentId',
    onDelete: 'CASCADE',
  });

  // Attendance associations
  AttendanceModel.belongsTo(ClassModel, {foreignKey: 'classId'});
  AttendanceModel.belongsToMany(StudentModel, {
    through: 'StudentAttendance', // Sequelize will create this table automatically
    foreignKey: 'attendanceId',
    otherKey: 'studentId',
    onDelete: 'CASCADE',
  });

  // Material associations
  MaterialModel.belongsTo(ClassModel, {foreignKey: 'classId'});

  // AbsenceRequest associations
  AbsenceRequestModel.belongsTo(StudentModel, {foreignKey: 'studentId'});
  AbsenceRequestModel.belongsTo(ClassModel, {foreignKey: 'classId'});

  // Survey associations
  SurveyModel.belongsTo(ClassModel, {foreignKey: 'classId'});
  SurveyModel.belongsTo(AccountModel, {
    as: 'creator',
    foreignKey: 'createdBy',
  });
  SurveyModel.hasMany(SurveyResponseModel, {foreignKey: 'surveyId', onDelete: 'CASCADE'});

  // SurveyResponse associations
  SurveyResponseModel.belongsTo(SurveyModel, {foreignKey: 'surveyId'});
  SurveyResponseModel.belongsTo(AccountModel, {
    as: 'respondent',
    foreignKey: 'respondentId',
  });

  // Notification associations
  NotificationModel.belongsTo(AccountModel, {
    as: 'sender',
    foreignKey: 'senderId',
  });
  NotificationModel.belongsTo(AccountModel, {
    as: 'recipient',
    foreignKey: 'recipientId',
  });

  // Conversation associations
  ConversationModel.belongsToMany(AccountModel, {
    through: 'ConversationParticipants', // Sequelize will create this table automatically
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
