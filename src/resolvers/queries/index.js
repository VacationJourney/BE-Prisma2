const Query = {
  user: async (__, args, { req, prisma }) => {
    const { where: { id } } = args
    return await prisma.user.findUnique({where: {id}})
  },
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
  note: (parent, args, { prisma }) => {
    const {where: {id}} = args
    return prisma.note({where: {id}});
  }
}

module.exports = Query