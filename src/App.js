import {useState, Fragment} from "react"
import './App.css';
import data from './data.json'
import ReadOnlyRow from './components/ReadOnlyRow'
import EditableRow from './components/EditableRow'
import {nanoid} from 'nanoid'

function App() {
  const [contacts, setContacts] = useState(data)
  const [query, setQuery] = useState("")
  const [searchColumns, setSearchColumns] = useState([
    'fullName',
    'email',
  ]);
  const [contact, addContact] = useState({
    fullName:"",
    address:"",
    phoneNumber:"",
    email:""
  })
  const [editedData, setEditedData] = useState({
    fullName:"",
    address:"",
    phoneNumber:"",
    email:""
  })
  const [editContactId, setEditContactId] = useState(null)

  const handleChange=(name, value)=>{
    addContact({...contact, [name]:value})
  }

  const handleEditedData=(name, value)=>{
    setEditedData({...editedData, [name]:value})
  }


  const handleSubmit=(e)=>{
      e.preventDefault()
      setContacts([...contacts, {...contact, id:nanoid()}])
  }

  const handleEditedDataSubmit = (e)=>{
    console.log(editedData)
    e.preventDefault()
    const index = contacts.findIndex((contact)=>contact.id === editContactId)
    const newContacts = [...contacts]
    newContacts[index] = {...editedData, id:editContactId }
    setContacts(newContacts)
    setEditContactId(null)
  }


  const handleEditClick = (event, contact)=>{
    event.preventDefault()
    setEditContactId(contact.id)

    const formValues = {
      fullName:contact.fullName,
      address:contact.address,
      phoneNumber:contact.phoneNumber,
      email:contact.email
    }
    setEditedData(formValues)
  }

  const handleCancelClick = ()=>{
    setEditContactId(null)
  }

  const handleDelete = (contactId)=>{
    setContacts([...contacts.filter(contact=>contact.id !== contactId)])
  }


  function search(rows) {
    return rows.filter((row) =>
      searchColumns.some(
        (column) =>
          row[column]
            .toString()
            .toLowerCase()
            .indexOf(query.toLowerCase()) > -1,
      ),
    );
  }

  const columns = contacts[0] && Object.keys(contacts[0]);

  const Ascend = (header)=>{
    const sortedContacts = [...contacts].sort(function(a, b) {
      var nameA = a[header]; // ignore upper and lowercase
      var nameB = b[header]; // ignore upper and lowercase
      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }
    
      // names must be equal
      return 0;
    });
    setContacts(sortedContacts)
  }
  
  const descend = (header)=>{
    const sortedContacts = [...contacts].sort(function(a, b) {
      var nameA = a[header]; // ignore upper and lowercase
      var nameB = b[header]; // ignore upper and lowercase
      if (nameA > nameB) {
        return -1;
      }
      if (nameA < nameB) {
        return 1;
      }
    
      // names must be equal
      return 0;
    });
    setContacts(sortedContacts)
  }
  return (
    <div className="App">
      <div>
        <input
          type='text'
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        {columns &&
          columns.map((column) => (
            <label>
              <input
                type='checkbox'
                checked={searchColumns.includes(column)}
                onChange={(e) => {
                  const checked = searchColumns.includes(column);
                  setSearchColumns((prev) =>
                    checked
                      ? prev.filter((sc) => sc !== column)
                      : [...prev, column],
                  );
                }}
              />
              {column}
            </label>
          ))}
      </div>
      <form onSubmit={handleEditedDataSubmit}>
        <table>
          <thead>
            <tr>
              <th>Name <span style={{cursor:'pointer'}} onClick={()=>descend('fullName')}>🔽</span> <span style={{cursor:'pointer'}} onClick={(event)=>Ascend('fullName')}>🔼</span></th>
              <th>Address <span style={{cursor:'pointer'}} onClick={()=>descend('address')}>🔽</span> <span style={{cursor:'pointer'}} onClick={(event)=>Ascend('address')}>🔼</span></th>
              <th>Phone <span style={{cursor:'pointer'}} onClick={()=>descend('phoneNumber')}>🔽</span> <span style={{cursor:'pointer'}} onClick={(event)=>Ascend('phoneNumber')}>🔼</span></th>
              <th>Email <span style={{cursor:'pointer'}} onClick={()=>descend('email')}>🔽</span> <span style={{cursor:'pointer'}} onClick={(event)=>Ascend('email')}>🔼</span></th>
              <th>Actions </th>
            </tr>
          </thead>
          <tbody>
            {search(contacts).map((contact)=>(
              <Fragment>
                {
                  editContactId === contact.id
                  ?
                  <EditableRow  handleCancelClick={ handleCancelClick} editedData={editedData} handleEditedData={handleEditedData}  />
                  :
                  <ReadOnlyRow handleDelete={handleDelete} contact={contact} handleEditClick={handleEditClick} />
                }   
              </Fragment>
            ))}
          </tbody>
        </table>
      </form>
      <div className="form">
      <h2>Add a contact</h2>
      <form onSubmit={handleSubmit}>
        <input 
        onChange={({ target: { name, value } }) => handleChange(name, value)}
        type="text" 
        name="fullName" 
        required="required" 
        placeholder="Enter a name"
        />
        <input
        onChange={({ target: { name, value } }) => handleChange(name, value)} 
        type="text" 
        name="address" 
        required="required" 
        placeholder="Enter an address"
        />
        <input
        onChange={({ target: { name, value } }) => handleChange(name, value)} 
        type="text" 
        name="phoneNumber" 
        required="required" 
        placeholder="Enter a phone number"
        />
        <input
        onChange={({ target: { name, value } }) => handleChange(name, value)} 
        type="email" 
        name="email" 
        required="required" 
        placeholder="Enter your email"
        />
        <input 
        type="submit"
        value="Add Contact"
        />
      </form>
      </div>
      
    </div>
  );
}

export default App;
