// CreateUserModal.js
import React, { useState } from 'react';
import './CreateUser.css'
const CreateUser = ({ isCreateModalOpen, setIsCreateModalOpen, handleCreateUser }) => {
  const [newUser, setNewUser] = useState({
    FirstName: '',
    LastName: '',
    Dob: '',
    Role: '',
    Username: '',
    Password: ''
  });

  return (
    <>
      {isCreateModalOpen && (
        <div className="modal">
          <h3>Create New User</h3>
          <input
            placeholder="First Name"
            value={newUser.FirstName}
            onChange={(e) => setNewUser({ ...newUser, FirstName: e.target.value })}
          />
          <input
            placeholder="Last Name"
            value={newUser.LastName}
            onChange={(e) => setNewUser({ ...newUser, LastName: e.target.value })}
          />
          <input
            type="date"
            value={newUser.Dob}
            onChange={(e) => setNewUser({ ...newUser, Dob: e.target.value })}
          />
          <select
            value={newUser.Role}
            onChange={(e) => setNewUser({ ...newUser, Role: e.target.value })}>
            <option value="" disabled>Select Role</option>
            <option value="User">User</option>
            <option value="Admin">Admin</option>
          </select>
          <input
            placeholder="Username"
            value={newUser.Username}
            onChange={(e) => setNewUser({ ...newUser, Username: e.target.value })}
          />
          <input
            type="password"
            placeholder="Password"
            value={newUser.Password}
            onChange={(e) => setNewUser({ ...newUser, Password: e.target.value })}
          />
          <div className="modal-actions">
            <button
              className="save-btn"
              onClick={() => {
                handleCreateUser(newUser);
                setIsCreateModalOpen(false);
                setNewUser({ FirstName: "", LastName: "", Dob: "", Role: "", Username: "", Password: "" });
              }}
            >
              Create
            </button>
            <button className="cancel-btn" onClick={() => setIsCreateModalOpen(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default CreateUser;