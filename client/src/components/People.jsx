import React from "react";
import { useQuery } from "@apollo/client";
import { GET_PEOPLE } from "../queries/people";

function People() {
  const { loading, error, data } = useQuery(GET_PEOPLE);

  return (
    <div>
      <h2>People</h2>
      {loading && <p>Loading...</p>}
      {error && <p>Error : {error.message}</p>}

      {data &&
        data.people.map(({ id, firstName, lastName, cars }) => (
          <div key={id}>
            <h3>
              {firstName} {lastName}
            </h3>
            <ul>
              {cars.map(({ id, year, make, model, price }) => (
                <li key={id}>
                  {year} {make} {model} - ${price}
                </li>
              ))}
            </ul>
          </div>
        ))}
    </div>
  );
}

export default People;
