import { useState, useEffect } from 'react'
import './index.css'
import Note from './components/Note'
import noteService from './services/notes'

//improved error message
const Notification = ( { message } ) => {
  if (message === null) {
    return null
  }
  return ( 
    <div className="error">
      {message}
    </div>
   );
}
 


const App = () => {
  const [notes, setNotes] = useState([])
  //state variable to take input
  const[newnote,setNewNote] = useState('')
  const[showAll,setShowAll] = useState(true)
  const [errorMessage, setErrorMessage] = useState('some error happened...')

  const toggleImportanceOf = (id) => {
    const note = notes.find(n => n.id === id)
    const changedNote = {...note, important : !note.important}

    noteService
    .update( id, changedNote)
    .then(returnedNote => {
      setNotes(notes.map(note => note.id !== id ? note : returnedNote))
    })
    .catch(error => {
      setErrorMessage(
        `Note '${note.content}' was already removed from server`
      )
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
      setNotes(notes.filter(n => n.id !== id))
    })
  }

  useEffect(() => {
   noteService
    .getAll()
    .then(initialNotes => {
      setNotes(initialNotes)
    })
  }, [])

  const addNote = (event) => {
    event.preventDefault()
    const noteObject = {
      content: newnote,
      important: Math.random() < 0.5,
      id: notes.length + 1
    }
    //add notes to json-server
    noteService
      .create(noteObject)
      .then( returnedNote => {
        setNotes(notes.concat(returnedNote))
        setNewNote("")
      })

  }

  const handleNewNote = (event) => {
    setNewNote(event.target.value)
  }

  const notesToShow = showAll ? notes : notes.filter(note => note.important === true)

  return (
    <div>
      <h1>Notes</h1>
      <Notification message={errorMessage} />
      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? 'important' : 'all' }
        </button>
      </div>
      <ul>
        <ul>
          {notesToShow.map(note =>
            <Note key={note.id} note={note}  toggleImportance={() => toggleImportanceOf(note.id)}/>
          )}
        </ul>
      </ul>
      <form onSubmit={ addNote }>
        <input value={newnote} onChange={handleNewNote}/>
        <button type="submit">save</button>
      </form>
    </div>
  )
}

export default App
