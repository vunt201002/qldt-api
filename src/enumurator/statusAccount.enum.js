const statusAccountEnum = Object.freeze({
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  values() {
    return Object.values(this);
  },
});

export default statusAccountEnum;
