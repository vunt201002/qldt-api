const statusMuster = Object.freeze({
  PRESENT: 'present',
  ABSENT: 'absent',
  values() {
    return Object.values(this);
  },
});

export default statusMuster;
