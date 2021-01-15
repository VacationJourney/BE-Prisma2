const Query = {
  
  vacations: async (__, args, { req, prisma }) => {
    const { where: { id } } = args
    return await prisma.user.findUnique({where: {id}}).vacations();
  },
  vacation: (parent, args, { prisma }) => {
    const {where: {id}} = args
    return prisma.vacation.findUnique({where: {id}});
  },
  day: (parent, args, { prisma }) => {
    const {where: {id}} = args
    return prisma.day.findUnique({where: {id}});
  },
  event: (parent, args, { prisma }) => {
    const {where: {id}} = args
    return prisma.event({where: {id}});
  },
}

module.exports = Query