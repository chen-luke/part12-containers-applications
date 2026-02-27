/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react'
import phonebookService from './service/phonebook'
import { v4 as uuidv4 } from 'uuid'

const Filter = ({ filter, handleFilterChange }) => {
  return (
    <div>
      <label htmlFor='filterNameInput'>
        filter shown with
        <input
          id='filterNameInput'
          type='text'
          value={filter}
          onChange={handleFilterChange}
        />
      </label>
    </div>
  )
}

const PersonForm = ({ formData, handlers }) => {
  const { newName, newNumber } = formData

  const { handleNameChange, handleNumberChange, addPerson } = handlers

  return (
    <>
      <form onSubmit={addPerson}>
        <div>
          <label htmlFor='addName'>
            name:
            <input id='addName' value={newName} onChange={handleNameChange} />
          </label>
        </div>
        <div>
          <label htmlFor='addNumber'>
            number:{' '}
            <input
              id='addNumber'
              value={newNumber}
              onChange={handleNumberChange}
            />
          </label>
        </div>
        <div>
          <button type='submit'>add</button>
        </div>
      </form>
    </>
  )
}

const Persons = ({ persons, handleDelete }) => (
  <>
    {persons.map((person) => (
      <div key={person.id}>
        {person.name} {person.number}{' '}
        <button onClick={() => handleDelete(person.id)}>delete</button>
      </div>
    ))}
  </>
)

const Notification = ({ message }) => {
  const style = {
    fontStyle: 'italic',
    fontSize: 16,
    borderStyle: 'solid',
    textAlign: 'center',
    padding: '5px 0px 5px 0px',
    marginBottom: '2em',
  }
  if (message.text === null) {
    return null
  }
  const color = message.type === 'success' ? 'green' : 'red'

  return (
    <div
      className='error'
      style={{
        ...style,
        color: color,
        borderColor: color,
      }}
    >
      {message.text}
    </div>
  )
}

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [message, setMessage] = useState({ type: null, text: null })

  // write a helper that validates if the new name already exist in current phonebook
  // then prompt the user if they want to update the user's old number with their new number
  const addPerson = (event) => {
    event.preventDefault()

    const existingPerson = persons.find(
      (person) => person.name.toLowerCase() === newName.toLowerCase(),
    )

    if (existingPerson) {
      const confirm = window.confirm(
        `${existingPerson.name} is already added to phonebook, replace the older number with a new one?`,
      )
      if (!confirm) return

      phonebookService
        .update(existingPerson.id, { ...existingPerson, number: newNumber })
        .then((response) =>
          setPersons(
            persons.map((person) =>
              person.id === existingPerson.id ? response.data : person,
            ),
          ),
        )
        .catch((error) => {
          setMessage({ type: null, text: `Failed to update person` })
          console.error(error)
          setTimeout(() => {
            setMessage({ type: null, text: null })
          }, 5000)
        })
    } else {
      const newPerson = {
        name: newName,
        number: newNumber,
        id: uuidv4(),
      }

      phonebookService
        .create(newPerson)
        .then((response) => {
          setPersons(persons.concat(response.data))
          setNewName('')
          setNewNumber('')
          setMessage({
            type: 'success',
            text: `Added Person ${newPerson.name}`,
          })
          setTimeout(() => {
            setMessage({ type: null, text: null })
          }, 5000)
        })
        .catch((error) => {
          setMessage({ type: null, text: `${error.response.data.error}` })
          setTimeout(() => {
            setMessage({ type: null, text: null })
          }, 5000)
        })
    }
  }

  const handleNameChange = (e) => {
    setNewName(e.target.value)
  }

  const handleNumberChange = (e) => {
    setNewNumber(e.target.value)
  }

  const handleDelete = (id) => {
    const confirm = window.confirm(
      'Are you sure you want to delete this record?',
    )
    if (!confirm) return
    const deletedPerson = persons.find((person) => person.id === id)
    phonebookService
      .deleteRecord(id)
      .then(() => {
        // console out the deleted data not the most current list
        setPersons(persons.filter((person) => person.id !== id))
        setMessage({
          type: 'success',
          text: `Deleted Person ${deletedPerson.name}`,
        })
        setTimeout(() => {
          setMessage({ type: null, text: null })
        }, 5000)
      })
      .catch((error) => {
        setMessage({
          type: 'error',
          text: `Information of ${deletedPerson.name} has already been removed from server`,
        })
        console.error(error)
        setTimeout(() => {
          setMessage({ type: null, text: null })
        }, 5000)
      })
  }

  const handleFilterChange = (e) => {
    setFilter(e.target.value)
  }

  const formData = { newName, newNumber }

  const handlers = { handleNameChange, handleNumberChange, addPerson }

  const filteredPersons = filter
    ? persons.filter((person) =>
        person.name.toLowerCase().includes(filter.toLowerCase()),
      )
    : persons

  useEffect(() => {
    // Fetch data and populate persons
    phonebookService
      .getAll()
      .then((response) => {
        setPersons(response.data)
      })
      .catch((error) => {
        console.error('Error Fetching Data:', error)
      })
  }, [])

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message} />
      <Filter filter={filter} handleFilterChange={handleFilterChange} />

      <h2>Add a new person</h2>
      <PersonForm formData={formData} handlers={handlers} />

      <h2>Numbers</h2>
      <Persons persons={filteredPersons} handleDelete={handleDelete} />
    </div>
  )
}

export default App
