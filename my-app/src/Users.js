import React, { useState, useEffect } from "react";
import './Users.css';
import CreateUser from './CreateUser.js'
import UpdateUserModal from './UpdateUser.js'
import { getUsers, createUser, updateUser, deleteUser } from './api/api.js'

const Users = () => {
	const [error, setError] = useState('');
	const [users, setUsers] = useState([]);
	const [selectedUser, setSelectedUser] = useState(null);
	const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
	const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);


	//use effect to fetch users when page is loaded
	useEffect(() => {
		fetchUsers();
	}, []);


	//function to fetch users
	const fetchUsers = async () => {
		try {
			const data = await getUsers();
			setUsers(data.users);
		} catch (err) {
			setError(err.message);
		}
	};


	//function to create a new user with entered data
	const handleCreateUser = async (newUser) => {
		if (!newUser.FirstName || !newUser.LastName || !newUser.Dob || !newUser.Role || !newUser.Username || !newUser.Password) {
			alert("Please fill in all the fields."); //if data not filled, show an alert and dont allow api call
			return;
		}

		try {
			await createUser(newUser); //send user data to api file
			fetchUsers();
		} catch (err) {
			setError(err.message);
		}
	};


	//function to update a users data
	const handleUpdateUser = async (updatedUser) => {
		try {
			updateUser(updatedUser); //send updated data to api file
			setIsUpdateModalOpen(false);
			fetchUsers();
		} catch (err) {
			setError(err.message);
		}
	};

	//function to delete selected user
	const handleDeleteUser = async (UserId) => {
		try {
			deleteUser(UserId); //send userId to api file
			fetchUsers();
		} catch (err) {
			setError(err.message);
		}
	};


	return (
		<div className="users-container">
			<div className="users-header">
				<h2>Users</h2>
				<button className="add-user-btn" onClick={() => setIsCreateModalOpen(!isCreateModalOpen)}>New User</button>
			</div>
			<table className="users-table">
				{error && <p className='error-message'>{error}</p>}
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
				<UpdateUserModal
					user={selectedUser}
					onClose={() => setIsUpdateModalOpen(false)}
					onSubmit={handleUpdateUser}
				/>
			)}
		</div>
	)
}
export default Users;