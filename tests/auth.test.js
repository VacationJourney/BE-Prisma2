require('cross-fetch/polyfill')
const {gql} = require('apollo-boost');
const {PrismaClient} = require('@prisma/client');
const {client} = require('./utils');

const prisma = new PrismaClient()

beforeAll(async () => {
  await prisma.user.deleteMany()
})

describe('Tests the User Authorization Crud', () => {
// SIGN_UP mutation
  test('should successfully authorize a user with upsert', async () => {
    const AUTHORIZE_USER = gql`
      mutation authorizeUser($username: String, $email: String!) {
        authorizeUser(username: $username, email: $email) {
          id
          username
          email
        }
      }
    `;
    const res = await client.mutate({
      mutation: AUTHORIZE_USER, variables: {username: "J2macwilliams", email: "j2mac@gmail.com"}
  })
  
  expect(res.data.authorizeUser.username).toMatch("J2macwilliams")
  
})
})