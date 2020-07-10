import React, { useState, useEffect } from 'react';
import Filter from './components/Filter';
import PersonForm from './components/PersonForm';
import Persons from './components/Persons';
import Notification from './components/Notification';
import personService from './services/persons';

const App = () => {
    const [persons, setPersons] = useState([]);
    const [newName, setNewName] = useState('');
    const [newNumber, setNewNumber] = useState('');
    const [filter, setFilter] = useState('');
    const [notifMessage, setNotifMessage] = useState(null);
    const [notifType, setNotifType] = useState('');

    useEffect(() => {
        personService
            .getAll()
            .then(initialPersons => setPersons(initialPersons));
    }, []);

    const handleNameChange = event => setNewName(event.target.value);
    const handleNumberChange = event => setNewNumber(event.target.value);
    const handleFilterChange = event => setFilter(event.target.value);
    const handleDeleteClick = (name, id) => () => {
        const result = window.confirm(`Delete ${name}?`)
        if (result) {
            personService
                .deletePerson(id)
                .then(deleted => {
                    setPersons(persons.filter(person => person.id !== id));
                    window.alert(`Successfully deleted ${name}, status ${deleted}`)
                });
        }
    }

    const addPerson = event => {
        if (!newName || !newNumber) {
            window.alert("You cannot empty the form");
            return;
        }

        event.preventDefault();
        const personObject = { name: newName, number: newNumber };
        const duplicateName = persons.some(person => person.name === newName);
        const duplicateNumber = persons.some(person => person.number === newNumber);

        if (duplicateName && duplicateNumber) {
            setNotifMessage(`${newName} is already added to phonebook`);
            setNotifType('error');
            setTimeout(() => {
                setNotifMessage(null);
            }, 5000);
            setNewName('');
            setNewNumber('');
        } else if (duplicateName) {
            const personId = persons.find(person => person.name === newName).id;
            const result = window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`);

            if (result) {
                personService
                    .updateNumber(personId, personObject)
                    .then(returnedPerson => {
                        setPersons(persons.map(person => person.id === personId ? { ...person, number: newNumber } : person));
                        setNotifMessage("Successfully updated the phone number!");
                        setNotifType('success');
                        setTimeout(() => {
                            setNotifMessage(null);
                        }, 5000);
                        setNewName('');
                        setNewNumber('');
                    })
                    .catch(err => {
                        setNotifMessage(`Information of ${newName} has already been removed from server`);
                        setNotifType('error');
                        setTimeout(() => {
                            setNotifMessage(null)
                        }, 5000);
                        setPersons(persons.filter(person => person.id !== personId));
                        setNewName('');
                        setNewNumber('');
                    });
            }
        } else {
            personService
                .create(personObject)
                .then(returnedPerson => {
                    setPersons(persons.concat(returnedPerson));
                    setNotifMessage(`Added ${newName}`);
                    setNotifType('success')
                    setNewName('');
                    setNewNumber('');
                    setTimeout(() => {
                        setNotifMessage(null);
                    }, 5000);
                })
        }
    };

    const personsToShow = filter
        ? persons.filter(person => person.name.toLowerCase().includes(filter.trim().toLowerCase()))
        : persons;

    return (
        <div>
            <h2>Phonebook</h2>
            <Notification message={notifMessage} type={notifType} />
            <Filter filter={filter} handleChange={handleFilterChange} />
            <h2>add a new</h2>
            <PersonForm
                addPerson={addPerson}
                newName={newName} handleNameChange={handleNameChange}
                newNumber={newNumber} handleNumberChange={handleNumberChange}
            />
            <h2>Numbers</h2>
            <Persons personsToShow={personsToShow} handleDelete={handleDeleteClick} />
        </div>
    )
}

export default App;