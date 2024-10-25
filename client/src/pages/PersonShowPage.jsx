import React from "react";
import { useQuery } from "@apollo/client";
import { GET_PERSON_WITH_CARS } from "../queries/people";
import { useParams } from "react-router-dom";

const PersonShowPage = () => {
  const { id } = useParams();

  const { loading, error, data } = useQuery(GET_PERSON_WITH_CARS, {
    variables: { id },
  });

  if (loading) return <p>Loading...</p>;

  if (error) return <p>Error: {error.message}</p>;

  const person = data.personWithCars;

  if (!person) return <p>No person found.</p>;

  return (
    <div>
      <h1>{`${person.firstName} ${person.lastName}`}</h1>
      <h2>Cars:</h2>
      <ul>
        {person.cars.map((car) => (
          <li key={car.id}>
            {`${car.year} ${car.make} ${car.model} - $${car.price}`}
          </li>
        ))}
      </ul>
      <button onClick={() => window.history.back()}>Go Back Home</button>
    </div>
  );
};

export default PersonShowPage;
