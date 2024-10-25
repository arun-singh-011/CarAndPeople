import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { DELETE_CAR, GET_CARS } from "../queries/cars";
import CarForm from "./CarForm";

const CarCard = ({ car }) => {
  const [editing, setEditing] = useState(false);
  const [deleteCar] = useMutation(DELETE_CAR, {
    update(cache, { data: { deleteCar } }) {
      const { cars } = cache.readQuery({ query: GET_CARS });

      cache.writeQuery({
        query: GET_CARS,
        data: {
          cars: cars.filter((c) => c.id !== deleteCar.id),
        },
      });
    },
    optimisticResponse: {
      __typename: "Mutation",
      deleteCar: {
        __typename: "Car",
        id: car.id,
        year: car.year,
        make: car.make,
        model: car.model,
        price: car.price,
        personId: car.personId,
      },
    },
    onCompleted: () => {
      console.log("Car deleted successfully");
    },
    onError: (error) => {
      console.error("Error deleting car:", error);
    },
  });

  const handleDelete = async () => {
    try {
      await deleteCar({
        variables: { id: car.id },

        optimisticResponse: {
          __typename: "Mutation",
          deleteCar: {
            __typename: "Car",
            id: car.id,
            year: car.year,
            make: car.make,
            model: car.model,
            price: car.price,
            personId: car.personId,
          },
        },
      });
    } catch (error) {
      console.error("Error executing deleteCar mutation:", error);
    }
  };

  return (
    <div style={styles.container}>
      <div
        style={{
          backgroundColor: "black",
          color: "white",
          padding: 8,
          fontWeight: "bold",
          fontSize: "22px",
          borderRadius: 10,
        }}
      >
        <p>
          {car.year} {car.make} {car.model} - ${car.price}
        </p>
      </div>
      <div style={styles.icon}>
        <FontAwesomeIcon
          icon={faEdit}
          color="green"
          size="lg"
          onClick={() => setEditing(!editing)}
        />
        <FontAwesomeIcon
          icon={faTrash}
          size="lg"
          color="red"
          onClick={handleDelete}
        />
      </div>
      {editing && (
        <CarForm car={car} onCompletedCar={(updatedCar) => setEditing(false)} />
      )}
    </div>
  );
};

export default CarCard;

const styles = {
  container: {
    padding: 10,
    margin: 10,
    backgroundColor: "black",
    borderRadius: 10,
  },
  icon: {
    display: "flex",
    justifyContent: "space-around",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 8,
  },
  info: {
    display: "flex",
    justifyContent: "space-between",
    backgrourndColor: "red",
    font: "bold",
  },
};
