import { gql } from "@apollo/client";

const GET_CARS = gql`
  query GetCars {
    cars {
      id
      year
      make
      model
      price
      personId
    }
  }
`;

const ADD_CAR = gql`
  mutation AddCar(
    $year: Int!
    $make: String!
    $model: String!
    $price: Float!
    $personId: ID!
  ) {
    addCar(
      year: $year
      make: $make
      model: $model
      price: $price
      personId: $personId
    ) {
      id
      year
      make
      model
      price
      personId
    }
  }
`;

const UPDATE_CAR = gql`
  mutation UpdateCar(
    $id: ID!
    $year: Int!
    $make: String!
    $model: String!
    $price: Float!
    $personId: ID!
  ) {
    updateCar(
      id: $id
      year: $year
      make: $make
      model: $model
      price: $price
      personId: $personId
    ) {
      id
      year
      make
      model
      price
      personId
    }
  }
`;
const DELETE_CAR = gql`
  mutation DeleteCar($id: ID!) {
    deleteCar(id: $id) {
      id
      year
      make
      model
      price
      personId
    }
  }
`;
export { GET_CARS, ADD_CAR, UPDATE_CAR, DELETE_CAR };
