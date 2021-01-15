const { ApolloServer } = require('apollo-server')
const { PrismaClient } = require('@prisma/client')
const resolvers = require('./resolvers/index');
const typeDefs = require('./typeDefs/index');

const server = new ApolloServer({
typeDefs,
  resolvers,
  context: req => ({
      prisma: new PrismaClient(),
      req
  })
})

module.exports = server