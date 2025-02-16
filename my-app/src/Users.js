import React, { useState, useEffect } from "react";
import './Users.css';
import CreateUser from './CreateUser.js'
import UpdateUser from './UpdateUser.js'
const Users = () => {
    const [users, setUsers] = useState([]);
    
    const [selectedUser, setSelectedUser] = useState(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    //use effect to fetch users when page is loaded
    useEffect(() => {
        fetchUsers();
    }, []);

    //API call to fetch users
    const fetchUsers = async () => {
        try {
            const response = await fetch("http://localhost:8080/api/users");
            const data = await response.json();
            
            if (!response.ok) throw new Error(data.message || "fetching users failed");
            setUsers(data.users);
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };
    //API call to create a new user with entered data
    const handleCreateUser = async (newUser) => {
        if (!newUser.FirstName || !newUser.LastName || !newUser.Dob || !newUser.Role || !newUser.Username || !newUser.Password) {
            alert("Please fill in all the fields.");
            return;
        }
        try {
            const response = await fetch("http://localhost:8080/api/users", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newUser),
            });
            const data = await response.json();
            
            if (!response.ok) throw new Error(data.message || "creating new user failed");
            fetchUsers();
        } catch (error) {
            console.error("Error creating user:", error);
        }
    };
    //API call to update user details that have been chaged
    const handleUpdateUser = async (updatedUser) => {
        try {
            const response = await fetch(`http://localhost:8080/api/users/${updatedUser.UserId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedUser),
            });
            const data = await response.json();
            
            if (!response.ok) throw new Error(data.message || "updating user failed");
            fetchUsers();
            setIsUpdateModalOpen(false);
        } catch (error) {
            console.error("Error updating user:", error);
        }
    };
    //API call to delete selected user
    const handleDeleteUser = async (UserId) => {
        try {
            const response = await fetch(`http://localhost:8080/api/users/${UserId}`, {
                method: "DELETE",
            });
            const data = await response.json();
            
            if (!response.ok) throw new Error(data.message || "deleting user failed");
            fetchUsers();
        } catch (error) {
            console.error("Error deleting user:", error);
        }
    };

    return (
        <div className="users-container">
            <div className="users-header">
                <h2>Users</h2>
                <button className="add-user-btn" onClick={() => setIsCreateModalOpen(!isCreateModalOpen)}>New User</button>
            </div>

            <table className="users-table">
                <thead>
                    <tr>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>DOB</th>
                        <th>Role</th>
                        <th>Username</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user.UserId}>
                            <td>{user.FirstName}</td>
                            <td>{user.LastName}</td>
                            <td>{new Date(user.Dob).toLocaleDateString()}</td>
                            <td>{user.Role}</td>
                            <td>{user.Username}</td>
                            <td className="action-buttons">
                            <button className="edit-btn" onClick={() => { setSelectedUser(user); setIsUpdateModalOpen(true); }}>Edit</button>
                                <button className="delete-btn" onClick={() => handleDeleteUser(user.UserId)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div>
                <CreateUser
                    isCreateModalOpen={isCreateModalOpen}
                    setIsCreateModalOpen={setIsCreateModalOpen}
                    handleCreateUser={handleCreateUser}
                />
            </div>
            {isUpdateModalOpen && selectedUser && (
                <UpdateUser
                    user={selectedUser}
                    onClose={() => setIsUpdateModalOpen(false)}
                    onSubmit={handleUpdateUser} // Pass handleUpdateUser to the modal
                />
            )}
        </div>
    )
}
export default Users;