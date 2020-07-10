import React from "react";

const Persons = ({ personsToShow, handleDelete }) => (
  <div>
    {personsToShow.map((person) => (
      <div key={person.name}>
        {person.name} {person.number} <button onClick={handleDelete(person.name, person.id)}>Delete</button>
      </div>
    ))}
  </div>
);

export default Persons;
