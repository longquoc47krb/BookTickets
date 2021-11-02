const objectId = (value, helpers) => {
  if (!value.match(/^[0-9a-fA-F]{24}$/)) {
    return helpers.message('"{{#label}}" must be a valid mongo id');
  }
  return value;
};

const password = (value, helpers) => {
  if (value.length < 8) {
    return helpers.message('Password phải ít nhất 8 kí tự');
  }
  if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
    return helpers.message('Password cần chứa ít nhất 1 chữ và 1 số');
  }
  return value;
};
const username = (value, helpers) => {
  if (!value.match(/^\s*([0-9a-zA-Z]+)\s*$/g)){
    return helpers.message('Tên đăng nhập không hợp lệ')
  }
  return value;
}

module.exports = {
  objectId,
  password,
  username
};
