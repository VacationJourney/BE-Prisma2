const { ApolloServer } = require('apollo-server')
const { PrismaClient } = require('@prisma/client')
const resolvers = require('./resolvers/index');
const typeDefs = require('./typeDefs/index');

const prisma = new PrismaClient()
const server = new ApolloServer({
typeDefs,
  resolvers,
  context: req => ({
      prisma,
      req
  })
})

module.exports = server