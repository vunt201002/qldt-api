const RoleEnum = Object.freeze({
  TEACHER: 'teacher',
  STUDENT: 'student',
  values() {
    return Object.values(this);
  },
});

export default RoleEnum;
