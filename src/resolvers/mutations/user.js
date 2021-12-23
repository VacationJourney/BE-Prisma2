const authorizeUser = async (__,  {username, email}, {prisma} ) => {
  const newUser = await prisma.user.upsert({
    where: { email},
    create: { username, email},
    update: { username, email}
  })
  return newUser
}

const deleteUser = async (__, {id}, {prisma}) => {
  return prisma.user.delete({where: {id}});
}

module.exports = { authorizeUser, deleteUser }

