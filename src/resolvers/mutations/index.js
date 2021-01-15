const { authorizeUser, deleteUser } = require('./user');
const { createVacation, updateVacation, deleteVacation, createDay, deleteDay } = require('./vacations');
const { createEvent, updateEvent, deleteEvent } = require('./events');

const Mutation = {
  authorizeUser, deleteUser,
  createVacation, updateVacation, deleteVacation, createDay, deleteDay, createEvent, updateEvent, deleteEvent
}

module.exports = Mutation