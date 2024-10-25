import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import CarForm from "./CarForm";
import { DELETE_PERSON } from "../queries/people";
import CarCard from "./CarCard";
import { text } from "@fortawesome/fontawesome-svg-core";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import PersonForm from "./PersonForm";

const PersonCard = ({ person }) => {
  const [editing, setEditing] = useState(false);
  const [deletePerson] = useMutation(DELETE_PERSON, {
    optimisticResponse: {
      deletePerson: person,
    },
    update(cache) {
      cache.modify({
        fields: {
          people(existingPeople = [], { readField }) {
            return existingPeople.filter(
              (pRef) => readField("id", pRef) !== person.id
            );
          },
        },
      });
    },
  });

  const handleDelete = () => {
    deletePerson({ variables: { id: person.id } });
  };

  return (
    <div style={styles.container}>
      <h3 style={{ fontSize: "24px" }}>
        {person.firstName} {person.lastName}
      </h3>
      {editing ? (
        <PersonForm person={person} onCompleted={() => setEditing(false)} />
      ) : (
        <div>
          {person.cars.map((car) => (
            <CarCard key={car.id} car={car} />
          ))}
        </div>
      )}
      <Link to={`/people/${person.id}`}>Learn more</Link>
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
    </div>
  );
};

export default PersonCard;
const styles = {
  container: {
    border: "2px solid black",
    padding: 10,
    margin: 10,
    marginBottom: 40,
    fontSize: "20px",
    textAlign: "center",
    backgroundColor: "lightgray",
    borderRadius: 10,
  },
  icon: {
    display: "flex",
    justifyContent: "space-around",

    borderRadius: 10,
    padding: 8,
  },
};
