const allRoles = {
  customer: ['getStations','getStation'],
  admin: ['getUsers', 'manageUsers','getStation','manageStation'],
};

const roles = Object.keys(allRoles);
const roleRights = new Map(Object.entries(allRoles));

module.exports = {
  roles,
  roleRights,
};

