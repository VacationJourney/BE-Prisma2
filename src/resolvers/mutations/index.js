const { authorizeUser, deleteUser } = require('./user');
const { createVacation, updateVacation, deleteVacation, createDay, deleteDay } = require('./vacations');
const { createEvent, updateEvent, deleteEvent } = require('./events');
const { createNote, updateNote, deleteNote } = require('./notes');


const Mutation = {
  authorizeUser, deleteUser,
  createVacation, updateVacation, deleteVacation, createDay, deleteDay, createEvent, updateEvent, deleteEvent, createNote, updateNote, deleteNote
}

module.exports = Mutation