import React, { useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { ADD_CAR, GET_CARS, UPDATE_CAR } from "../queries/cars";
import { GET_PEOPLE } from "../queries/people";

const CarForm = ({ car, onCompletedCar }) => {
  const [year, setYear] = useState(car ? car.year : "");
  const [make, setMake] = useState(car ? car.make : "");
  const [model, setModel] = useState(car ? car.model : "");
  const [price, setPrice] = useState(car ? car.price : "");
  const [personId, setPersonId] = useState(car ? car.personId : "");

  const { data } = useQuery(GET_PEOPLE);

  const [addCar, { error: addError }] = useMutation(ADD_CAR, {
    update(cache, { data: { addCar } }) {
      const { cars } = cache.readQuery({ query: GET_CARS });
      cache.writeQuery({
        query: GET_CARS,
        data: { cars: cars.concat([addCar]) },
      });
    },
    optimisticResponse: {
      __typename: "Mutation",
      addCar: {
        id: new Date().getTime(),
        year: parseInt(year, 10),
        make,
        model,
        price: parseFloat(price),
        personId,
        __typename: "Car",
      },
    },
    onCompleted: (data) => {
      onCompletedCar(data.addCar);

      resetForm();
    },
    onError: (error) => {
      console.error("Error adding car:", error);
    },
  });

  const [updateCar, { error: updateError }] = useMutation(UPDATE_CAR, {
    update(cache, { data: { updateCar } }) {
      const { cars } = cache.readQuery({ query: GET_CARS });
      const updatedCars = cars.map((c) =>
        c.id === updateCar.id ? updateCar : c
      );
      cache.writeQuery({
        query: GET_CARS,
        data: {
          cars: cars.map((car) =>
            car.id === updateCar.id ? { ...car, ...updateCar } : car
          ),
        },
      });
    },
    onCompleted: (data) => {
      onCompletedCar(data.updateCar);

      resetForm();
    },
    onError: (error) => {
      console.error("Error updating car:", error);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    const carData = {
      id: car ? car.id : undefined,
      year: parseInt(year, 10),
      make,
      model,
      price: parseFloat(price),
      personId,
    };

    if (car) {
      updateCar({ variables: carData });
    } else {
      addCar({ variables: carData });
    }
  };

  const resetForm = () => {
    setYear("");
    setMake("");
    setModel("");
    setPrice("");
    setPersonId("");
  };
  return (
    <div style={styles.form}>
      <div>
        <form onSubmit={handleSubmit}>
          <h2 style={{ textAlign: "center" }}>Add Car</h2>
          <input
            type="number"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            placeholder="Year"
            required
            style={{ height: 25, marginRight: 10 }}
          />
          <input
            value={make}
            onChange={(e) => setMake(e.target.value)}
            placeholder="Make"
            required
            style={{ height: 25, marginRight: 10 }}
          />
          <input
            value={model}
            onChange={(e) => setModel(e.target.value)}
            placeholder="Model"
            required
            style={{ height: 25, marginRight: 10 }}
          />
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Price"
            required
            style={{ height: 25, marginRight: 10 }}
          />
          <select
            value={personId}
            onChange={(e) => setPersonId(e.target.value)}
            required
            style={{ height: 30, marginRight: 10 }}
          >
            <option value="">Select Owner</option>
            {data?.people.map(({ id, firstName, lastName }) => (
              <option key={id} value={id}>
                {firstName} {lastName}
              </option>
            ))}
          </select>
          <button
            style={{
              marginRight: 10,

              border: "none",
              borderRadius: 5,
              backgroundColor: "orange",
              color: "white",
              paddingLeft: 20,
              paddingRight: 20,
              paddingTop: 5,
              paddingBottom: 5,

              fontSize: "20px",
            }}
            type="submit"
          >
            {car ? "Update" : "Add Car"}
          </button>
          {(addError || updateError) && (
            <p>
              Error adding/updating car:
              {addError?.message || updateError?.message}
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default CarForm;
const styles = {
  form: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30,
  },
};
