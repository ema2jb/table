import React from 'react';

const EditableRow = ({handleEditedData, editedData, handleCancelClick})=>{
    return (
        <tr>
            <td>
                <input 
                onChange={({ target: { name, value } }) => handleEditedData(name, value)}
                type="text" 
                name="fullName" 
                required="required" 
                placeholder="Enter a name"
                value={editedData.fullName}
                />
            </td>
            <td>
                <input
                onChange={({ target: { name, value } }) => handleEditedData(name, value)}
                type="text" 
                name="address" 
                required="required" 
                placeholder="Enter an address"
                value={editedData.address}
                />
            </td>
            <td>
                <input
                onChange={({ target: { name, value } }) => handleEditedData(name, value)}
                type="text" 
                name="phoneNumber" 
                required="required" 
                placeholder="Enter a phone number"
                value={editedData.phoneNumber}
                />
            </td>
            <td>
                <input
                onChange={({ target: { name, value } }) => handleEditedData(name, value)}
                type="email" 
                name="email" 
                required="required" 
                placeholder="Enter your email"
                value={editedData.email }
                />
            </td>
            <td>
                <button type="submit">Save</button>
                <button type="button" onClick={handleCancelClick}>Cancel</button>
            </td>
        </tr>
    )
}

export default EditableRow