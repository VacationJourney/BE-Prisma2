// for the events
const createEvent = async (parent, args, { prisma }, info) => {
  // Create Event
  // args & variables
  const {data: {title, startTime, endTime, location, contact, cost, description, date, tripId}} = args
  const id = date.connect.id
  
  const event = await prisma.event.create({data: {
    title, startTime, endTime, location, contact, cost, description, Day: date
  }});
  // Promise for update day cost
  const dayEvents = await prisma.day.findUnique({where: { id } }).events()
  const newDayCost = dayEvents.map(event => event.cost).reduce((total, value) => total - value, 0)
  await prisma.day.update({
    data: {
      cost: newDayCost
    },
    where: { id}
  })
  
  const vacationFound = await prisma.vacation.findUnique({where: { id: tripId }}).dates()
  
  const newVacationCost = vacationFound.map(date => date.cost).reduce((total, value) => total + value, 0)
  await prisma.vacation.update({
    data: {
      cost: newVacationCost
    },
    where: { id: tripId }
  })
  return event;
}

const updateEvent = async (parent, args, { prisma }, info) => {
  const { data: { title, startTime, endTime, location, contact, cost, description, dateId, tripId }, where: { id } } = args
  const event = await prisma.event.update({
    data: {
      title,
      startTime,
      endTime,
      location,
      contact,
      cost,
      description
    },
    where: { id }
  });
  // Promise for update day cost
  const dayEvents = await prisma.day.findUnique({where: { id: dateId }}).events()
  console.log('dayEvents', dayEvents)
  const newDayCost = dayEvents.map(event => event.cost).reduce((total, value) => total - value, 0)
  await prisma.day.update({
    data: {
      cost: newDayCost
    },
    where: { id: dateId }
  })
  // // Promise for update Vacation Cost
  const vacationFound = await prisma.vacation.findUnique({where:{ id: tripId }}).dates()
  const newVacationCost = vacationFound.map(date => date.cost).reduce((total, value) => total + value, 0)
  await prisma.vacation.update({
    data: {
      cost: newVacationCost
    },
    where: { id: tripId }
  })
  return event;
}

const deleteEvent = async (parent, { id, dayId, tripId }, { prisma }, info) => {
  const deletedEvent = await prisma.event.delete({where:{ id }})
  // Promise for update day cost
  const dayFound = await prisma.day.findUnique({where:{ id: dayId }}).events()
  const newDayCost = dayFound.map(event => event.cost).reduce((total, value) => total - value, 0)
  await prisma.day.update({
    data: {
      cost: newDayCost
    },
    where: { id: dayId }
  })
  // Promise for update Vacation Cost
  const vacationFound = await prisma.vacation.findUnique({where: { id: tripId }}).dates()
  const newVacationCost = vacationFound.map(date => date.cost).reduce((total, value) => total + value, 0)
  await prisma.vacation.update({
    data: {
      cost: newVacationCost
    },
    where: { id: tripId }
  })
  return deletedEvent;
}

module.exports = { createEvent, updateEvent, deleteEvent }