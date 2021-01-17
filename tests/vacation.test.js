require('cross-fetch/polyfill')
const {gql} = require('apollo-boost');
const {PrismaClient} = require('@prisma/client');
const {client} = require('./utils');
const prisma = new PrismaClient()

// First - Set up clean slate environment
let userId
let vacationID
let dateID
beforeAll(async () => {
  await prisma.user.deleteMany()
  
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
  userId = res.data.authorizeUser.id
})


describe('Tests Authenticated Current User & the Vacation Resolver Logic', () => {
  
// CREATE_VACATION mutation
  test('should create a vacation for an authenticated user', async () => {
    const CREATE_VACATION = gql`
	mutation createVacation(
		$title: String!
		$budget: Int
		$dates: [DayCreateWithoutTripInput!]
		$userId: ID
	) {
		createVacation(
			data: {
				title: $title
				budget: $budget
				dates: { create: $dates }
				traveler: {connect: {id: $userId}}
			}
		) {
			id
			title
			budget
			dates{
				id
				date
			}
		}
	}
`;

    const vacationRes = await client.mutate({
      mutation: CREATE_VACATION, variables: {title: "Hawaii", budget: 5000, dates: [ {date: "2021-10-15"},{ date: "2021-10-16"}], userId: userId}
    })
    vacationID = vacationRes.data.createVacation.id
    expect(vacationRes.data.createVacation.title).toMatch("Hawaii")
  });

// single VACATION query
  test('should query for a single vacation', async () => {
    const VACATION = gql`
        query vacation($id: ID!){
          vacation(where: {id: $id}){
            id
            title
            dates{
              id
              date
              events{
                id
                title
              }
            }
          }
        }
    `;

    const vacationQueryRes = await client.query({
      query: VACATION, variables: {id: vacationID}
    })
    expect(vacationQueryRes.data.vacation.title).toMatch("Hawaii")
  })



// UPDATE_VACATION mutation
  test('should update a vacation ', async () => {
    const UPDATE_VACATION =gql`
      mutation updateVacation(
        $id: ID
        $title: String
        $dates: [DayCreateWithoutTripInput!]
      ) {
        updateVacation(
          data: { title: $title, dates: { create: $dates } }
          where: {id: $id}
        ) {
          id
          title
          dates {
            id
            date
          }
        }
      }
    `;
    const updateRes =  await client.mutate({
      mutation: UPDATE_VACATION, variables: {id: vacationID, title: "Peru", dates: [{date: '2021-07-26'},{date: '2021-07-27'},{date: '2021-07-28'},{date: '2021-07-29'}]
      }
    })
    expect(updateRes.data.updateVacation.title).toMatch("Peru")
    dateID = updateRes.data.updateVacation.dates[0].id
  })


// VACATIONS query
  test('should return the vacations if authenticated', async () => {
    const VACATIONS = gql`
      query vacations($id: ID) {
        vacations(where: {id: $id}) {
          id
          title
          cost
          dates {
            id
            date
            cost
            events {
              id
              title
              cost
            }
          }
        }
      }
    `;
    const vacationQueryRes = await client.query({
      query: VACATIONS, variables: {id: userId}
    })
    
    expect(vacationQueryRes.data.vacations[0].title).toMatch("Peru")
  })

// DELETE_DAY mutation
  test('should delete a day', async () => {
    const DELETE_DAY = gql`
      mutation deleteDay($id: ID!, $tripId: ID!) {
        deleteDay(id: $id, tripId: $tripId) {
          id
          date
        }
      }
    ` 
    const deleteDayRes = await client.mutate({
      mutation: DELETE_DAY, variables: { id: dateID, tripId: vacationID }
    })
    
    expect(deleteDayRes.data.deleteDay.id).toMatch(dateID);
    
  })

// DELETE_VACATION mutation
  test('should delete a vacation', async () => {
    const DELETE_VACATION = gql`
      mutation deleteVacation($id: ID!) {
        deleteVacation(id: $id) {
          id
          title
        }
      }
    `;
  const deleteRes = await client.mutate({
    mutation: DELETE_VACATION, variables: {id: vacationID}
  })
  
    expect(deleteRes.data.deleteVacation.id).toMatch(vacationID);
  })
});