require('cross-fetch/polyfill')
const {gql} = require('apollo-boost');
const {PrismaClient} = require('@prisma/client');
const {client} = require('./utils');
const {AUTHORIZE_USER, CREATE_VACATION, UPDATE_VACATION, DELETE_VACATION, CREATE_DAY, DELETE_DAY, CREATE_EVENT, UPDATE_EVENT, DELETE_EVENT, GET_ONE_USER, GET_ONE_TRIP, GET_VACATIONS, GET_ONE_DATE, GET_ONE_EVENT} = require('./GraphQL')
const prisma = new PrismaClient()

// establish variables
let userID
let vacationID
let dateID
let eventID
// First - Set up clean slate environment
beforeAll(async () => {
  await prisma.user.deleteMany()
})

describe('Tests Resolvers Logic', () => {
  // AUTHORIZE_USER mutation
  test('should successfully authorize a user with upsert', async () => {
    
    const res = await client.mutate({
      mutation: AUTHORIZE_USER, variables: {username: "J2macwilliams", email: "j2mac@gmail.com"}
  })
  userID = res.data.authorizeUser.id
  expect(res.data.authorizeUser.username).toMatch("J2macwilliams")
})
  
// CREATE_VACATION mutation
  test('should create a vacation for an authenticated user', async () => {
    
    const vacationRes = await client.mutate({
      mutation: CREATE_VACATION, variables: {title: "Hawaii", budget: 5000, dates: [ {date: "2021-10-15"},{ date: "2021-10-16"}], userId: userID}
    })
   
    dateID = vacationRes.data.createVacation.dates[0].id
    vacationID = vacationRes.data.createVacation.id
    expect(vacationRes.data.createVacation.title).toMatch("Hawaii")
  });

// GET_ONE_TRIP query
  test('should query for a single vacation', async () => {

    const vacationQueryRes = await client.query({
      query: GET_ONE_TRIP, variables: {id: vacationID}
    })
    
    expect(vacationQueryRes.data.vacation.title).toMatch("Hawaii")
    
  })

// UPDATE_VACATION mutation
  test('should update a vacation ', async () => {
    
    const updateRes =  await client.mutate({
      mutation: UPDATE_VACATION, variables: {id: vacationID, title: "Peru", budget: 5000}
    })
    expect(updateRes.data.updateVacation.title).toMatch("Peru")
    
  })

// VACATIONS query
  test('should return the all the vacations', async () => {
   
    await client.mutate({
      mutation: CREATE_VACATION, variables: {title: "Spain", budget: 5000, dates: [ {date: "2021-07-15"},{ date: "2021-07-16"}], userId: userID}
    })
    const vacationQueryRes = await client.query({
      query: GET_VACATIONS, variables: {id: userID}
    })
    
    expect(vacationQueryRes.data.vacations.length).toBe(2)
  
    await client.mutate({
      mutation: DELETE_VACATION, variables: {id: vacationQueryRes.data.vacations[1].id}
    })
  })

// CREATE_DAY mutation
  test('should create a day', async () => {
    const dayCreateRes = await client.mutate({
      mutation: CREATE_DAY, variables: {date: "2021-10-17", cost: 0, tripId: vacationID}
    })
    expect(dayCreateRes.data.createDay.date).toMatch("2021-10-17")
  })

  // CREATE_EVENT mutation
  test('should create an event', async () => {
    const eventCreateRes = await client.mutate({
      mutation: CREATE_EVENT, variables: {title: "Dinner", startTime: "6:30pm", cost: 200, location: "Luau", dateId: dateID, tripId: vacationID, vacation: vacationID}
    })
    
    eventID = eventCreateRes.data.createEvent.id
    expect(eventCreateRes.data.createEvent.title).toMatch("Dinner")
  })

  // UPDATE_EVENT mutation
  test('should update an event', async () => {
    const eventUpdateRes = await client.mutate({
      mutation: UPDATE_EVENT, variables: {id: eventID, title: "Luau", cost: 300, dateId: dateID, tripId: vacationID}
    })
    
    expect(eventUpdateRes.data.updateEvent.cost).toBe(300)
  })

  // DELETE_EVENT mutation
  test('should delete an event', async () => {
    const eventDeleteRes = await client.mutate({
      mutation: DELETE_EVENT, variables: {id: eventID, dayId: dateID, tripId: vacationID}
    })
    expect(eventDeleteRes.data.deleteEvent.title).toMatch('Luau')
  })

// DELETE_DAY mutation
  test('should delete a day', async () => {
    
    const deleteDayRes = await client.mutate({
      mutation: DELETE_DAY, variables: { id: dateID, tripId: vacationID }
    })
    
    expect(deleteDayRes.data.deleteDay.id).toMatch(dateID);
  })

// DELETE_VACATION mutation
  test('should delete a vacation', async () => {
    
  const deleteRes = await client.mutate({
    mutation: DELETE_VACATION, variables: {id: vacationID}
  })
    expect(deleteRes.data.deleteVacation.id).toMatch(vacationID);
  })
  // GET_ONE_USER query
  test('should return no vacation info', async () => {
    const userQueryRes = await client.query({
      query: GET_ONE_USER, variables: {id: userID}
    })
    
    expect(userQueryRes.data.user.vacations.length).toBe(0)
  })
});