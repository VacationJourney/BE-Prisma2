const User = {
  vacations(parent, args, {prisma}) {
    return prisma.user.findUnique({where: {id: parent.id}}).vacations();
  },
}

const Vacation = {
  dates(parent, args, { prisma }) {
    return prisma.vacation.findUnique({where: {id: parent.id}}).dates({orderBy: {date : 'asc'}});
  },
}

const Day = {
  events: (parent, args, { prisma }) => {
    return prisma.day.findUnique({where: {id: parent.id} }).events({orderBy: {startTime: 'asc'}});
  },
  notes: (parent, args, { prisma }) => {
    return prisma.day.findUnique({where: {id: parent.id} }).notes();
  }
}


const Event = {
  date(parent, args, { prisma }) {
    // console.log('User -> context', prisma)
    return prisma.event.findUnique({where: {id: parent.id}});
  },
}




const Node  = {
  __resolveType() {
    return null;
  }
}

module.exports = {User, Vacation, Day, Event, Node}