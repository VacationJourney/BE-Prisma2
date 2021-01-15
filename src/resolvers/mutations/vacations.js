const createVacation = async (parent, args, { prisma }) => {

const {data: {title, budget, dates, traveler}} = args
  const vacation = await prisma.vacation.create({
    data: {
      title,
      budget,
      cost: 0,
      dates,
      traveler
    },
  });
  return vacation;
}

//needs work BUGS
const updateVacation = async (parent, args, { prisma }) => {
  const {data: {title, budget }, where: {id}} = args
  const updatedVacation = await prisma.vacation.update({
    data: { title, budget}, where: {id}
  })
  return updatedVacation;
}

const deleteVacation = async (parent, {id}, { prisma }, info) => {
  await prisma.day.deleteMany({where:  {vacationId: id}})
  return prisma.vacation.delete({where: {id}});
}

const createDay = async (parent, args, { prisma }, info) => {
  const {data: {trip, date, cost}} = args
  const addedDay = await prisma.day.create({
    data: {
      Vacation: trip,
      date,
      cost
    }
  })
  return addedDay
}

const deleteDay = async (parent, { id, tripId }, { prisma }, info) => {
  const deletedDay = await prisma.day.delete({where: {id}  })
  // Promise for updating vacation cost
  const vacationFound = await prisma.vacation.findUnique({where: {id: tripId }}).dates()
  const newVacationCost = vacationFound.map(date => date.cost).reduce((total, value) => total + value, 0)
  await prisma.vacation.update({
    data: {
      cost: newVacationCost
    },
    where: { id: tripId }
  })
  return deletedDay;
}



module.exports = { createVacation, updateVacation, deleteVacation, createDay, deleteDay }
