import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import {
  ADD_PERSON,
  UPDATE_PERSON,
  DELETE_PERSON,
  GET_PEOPLE,
} from "../queries/people";

const PersonForm = ({ person, onCompleted }) => {
  const [firstName, setFirstName] = useState(person ? person.firstName : "");
  const [lastName, setLastName] = useState(person ? person.lastName : "");

  const [addPerson] = useMutation(ADD_PERSON, {
    update(cache, { data: { addPerson } }) {
      const { people } = cache.readQuery({ query: GET_PEOPLE }) || {
        people: [],
      };
      cache.writeQuery({
        query: GET_PEOPLE,
        data: { people: people.concat([addPerson]) },
      });
    },
    onCompleted: (data) => {
      onCompleted(data.addPerson);
      setFirstName("");
      setLastName("");
    },
    optimisticResponse: {
      addPerson: {
        id: Date.now(),
        firstName,
        lastName,
        __typename: "Person",
      },
    },
  });

  const [updatePerson] = useMutation(UPDATE_PERSON, {
    update(cache, { data: { updatePerson } }) {
      const { people } = cache.readQuery({ query: GET_PEOPLE }) || {
        people: [],
      }; // Add a fallback
      cache.writeQuery({
        query: GET_PEOPLE,
        data: {
          people: people.map((p) =>
            p.id === updatePerson.id ? updatePerson : p
          ),
        },
      });
    },
    onCompleted: (data) => {
      onCompleted(data.updatePerson);
    },
    optimisticResponse: {
      updatePerson: {
        id: person ? person.id : null,
        firstName,
        lastName,
        cars: [],

        __typename: "Person",
      },
    },
  });

  const [deletePerson] = useMutation(DELETE_PERSON, {
    update(cache, { data: { deletePerson } }) {
      const { people } = cache.readQuery({ query: GET_PEOPLE }) || {
        people: [],
      }; // Add a fallback
      cache.writeQuery({
        query: GET_PEOPLE,
        data: {
          people: people.filter((p) => p.id !== deletePerson.id),
        },
      });
    },
    optimisticResponse: {
      deletePerson: {
        id: person ? person.id : null,
        __typename: "Person",
      },
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (person) {
      updatePerson({ variables: { id: person.id, firstName, lastName } });
    } else {
      addPerson({ variables: { firstName, lastName } });
    }
  };

  const handleDelete = () => {
    if (person) {
      deletePerson({ variables: { id: person.id } });
    }
  };

  return (
    <div style={styles.form}>
      <div>
        <h2 style={{ textAlign: "center" }}>Add Person</h2>
        <form onSubmit={handleSubmit}>
          <label required style={{ margin: 10 }}>
            First name:{" "}
            <input
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="First Name"
              required
              style={{ height: 25 }}
            />
          </label>
          <label style={{ margin: 10 }} required>
            Last name:{" "}
            <input
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Last Name"
              required
              style={{ height: 25 }}
            />
          </label>
          <button
            style={{
              marginRight: 10,
              border: "none",
              borderRadius: 5,
              backgroundColor: "black",
              color: "white",
              paddingLeft: 20,
              paddingRight: 20,
              paddingTop: 5,
              paddingBottom: 5,
              fontSize: "20px",
            }}
            type="submit"
          >
            {person ? " Update" : " Add Person"}
          </button>
          {person && (
            <button
              style={{
                border: "none",
                borderRadius: 5,
                backgroundColor: "red",
                color: "white",
                paddingLeft: 20,
                paddingRight: 20,
                paddingTop: 5,
                paddingBottom: 5,
                fontSize: "20px",
              }}
              type="button"
              onClick={handleDelete}
            >
              Delete Person
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default PersonForm;

const styles = {
  form: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
};
