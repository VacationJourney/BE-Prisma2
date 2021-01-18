const {gql} = require('apollo-boost');
// Mutations
export const AUTHORIZE_USER = gql`
  mutation authorizeUser($username: String, $email: String!) {
    authorizeUser(username: $username, email: $email) {
      id
      username
      email
    }
  }
`
export const CREATE_VACATION = gql`
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

export const UPDATE_VACATION =gql`
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

export const DELETE_VACATION = gql`
  mutation deleteVacation($id: ID!) {
    deleteVacation(id: $id) {
      id
      title
    }
  }
`

export const CREATE_DAY = gql`
	mutation createDay($tripId: ID, $date: String!, $cost: Int) {
		createDay(
			data: { trip: { connect: { id: $tripId } }, date: $date, cost: $cost }
		) {
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
`


export const DELETE_DAY = gql`
  mutation deleteDay($id: ID!, $tripId: ID!) {
    deleteDay(id: $id, tripId: $tripId) {
      id
      date
    }
  }
` 

export const CREATE_EVENT = gql`
	mutation CreateEvent(
		$title: String!
		$startTime: String
		$endTime: String
		$location: String
		$contact: String
		$cost: Int
		$description: String
		$dateId: ID!
		$tripId: ID
		$vacation: ID
	) {
		createEvent(
			data: {
				title: $title
				date: {connect: {id: $dateId}}
				startTime: $startTime
				endTime: $endTime
				location: $location
				contact: $contact
				cost: $cost
				description: $description
				tripId: $tripId
				trip: {connect: {id: $vacation}}
			}
		) {
			id
			title
			startTime
			endTime
			location
			contact
			cost
			description
		}
	}
`;

export const UPDATE_EVENT = gql`
  mutation updateEvent(
		$id: ID
		$title: String
		$startTime: String
		$endTime: String
		$location: String
		$contact: String
		$cost: Int
		$description: String
		$tripId: ID
		$dateId: ID
	) {
		updateEvent(
			data: {
				title: $title
				startTime: $startTime
				endTime: $endTime
				location: $location
				contact: $contact
				cost: $cost
				description: $description
				dateId: $dateId
				tripId: $tripId
			}
			where: { id: $id }
		) {
			id
			title
			startTime
			endTime
			location
			contact
			cost
			description
		}
	}

`;

export const DELETE_EVENT = gql`
	mutation DeleteEvent($id: ID!, $dayId: ID!, $tripId: ID!) {
		deleteEvent(id: $id, dayId: $dayId, tripId: $tripId) {
			id
			title
		}
	}
`;

// Queries

export const GET_ONE_USER = gql`
  query user($id: ID) {
    user(where: {id: $id}){
      id
      username
      email
      vacations{
        id
        title
        dates{
          id
          date
          cost
          events{
            id
            title
            cost
          }
        }
      }
    }
  }
`

export const GET_ONE_TRIP = gql`
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

export const GET_VACATIONS = gql`
  query vacations($id: ID) {
    vacations(where: { id: $id }) {
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
          tripId
        }
      }
    }
  }
`

export const GET_ONE_DATE = gql`
  query Day($id: ID) {
    day(where: { id: $id }) {
      id
      date
      cost
      events {
        id
        title
        startTime
        endTime
        description
        cost
      }
    }
  }
`;

export const GET_ONE_EVENT = gql`
  query Event($id: ID) {
    event(where: { id: $id }) {
      id
      title
      startTime
      endTime
      location
      contact
      cost
      description
    }
  }
`;