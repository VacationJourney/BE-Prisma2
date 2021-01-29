const createNote = async (parent, args, { prisma }) => {

  const { data: { title, idea, date, trip } } = args
  const note = await prisma.note.create({
    data: {
      title,
      idea,
      Day: date,
      Vacation: trip
    }
  })
  return note
}

const updateNote = async (parent, args, { prisma }) => {
  const { data: { title, idea }, where: { id } } = args
  const updatedNote = await prisma.note.update({
    data: {
      title,
      idea
    },
    where: { id }
  })
  return updatedNote
}

const deleteNote = async (parent, args, {prisma}) => {
  const {where: {id}} = args
  return await prisma.note.delete({where: {id}})
}

module.exports = { createNote, updateNote, deleteNote }