import React from "react";
import { useState, useEffect } from "react";
import People from "../components/People";
import PersonForm from "../components/PersonForm";
import PersonCard from "../components/PersonCard";
import { useQuery } from "@apollo/client";
import { GET_PEOPLE } from "../queries/people";
import { GET_CARS } from "../queries/cars";
import CarForm from "../components/CarForm";

function HomePage() {
  const [people, setPeople] = useState([]);
  const [cars, setCars] = useState([]);
  const {
    data: peopleData,
    loading: peopleLoading,
    error: peopleError,
  } = useQuery(GET_PEOPLE);
  const {
    data: carsData,
    loading: carsLoading,
    error: carsError,
  } = useQuery(GET_CARS);

  const onCompleted = (person) => {
    console.log("Person added or updated:", person);
  };

  const onCompletedCar = (car) => {
    console.log("Car added:", car);

    setCars((prevCars) => [...prevCars, car]);
  };

  useEffect(() => {
    if (peopleData) {
      setPeople(peopleData.people);
    }
  }, [peopleData]);

  useEffect(() => {
    if (carsData) {
      setCars(carsData.cars);
    }
  }, [carsData]);

  return (
    <div>
      <h2 style={{ textAlign: "center", marginTop: 20 }}>
        PEOPLE AND THEIR CARS
      </h2>

      <PersonForm onCompleted={onCompleted} />
      <CarForm onCompletedCar={onCompletedCar} />
      <h3
        style={{
          textAlign: "center",
          fontSize: "30px",
          marginBottom: 40,
          marginTop: 40,
        }}
      >
        Records
      </h3>
      {people.map((person) => (
        <PersonCard key={person.id} person={person} />
      ))}
    </div>
  );
}

export default HomePage;
