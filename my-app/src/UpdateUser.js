import React, { useState, useEffect } from 'react';

const UpdateUser = ({ user, onClose, onSubmit }) => {
    const [formData, setFormData] = useState({ ...user });

    useEffect(() => {
        setFormData({
            ...user,
            Dob: user.Dob ? new Date(user.Dob).toISOString().split("T")[0] : ""
        });
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData); //Pass the updated user data back to Users.js
    };

    return (
        <div className="modal">
            <h3>Edit User</h3>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="FirstName"
                    value={formData.FirstName}
                    onChange={handleChange}
                    placeholder="First Name"
                />
                <input
                    type="text"
                    name="LastName"
                    value={formData.LastName}
                    onChange={handleChange}
                    placeholder="Last Name"
                />
                <input
                    type="date"
                    name="Dob"
                    value={formData.Dob || ""}
                    onChange={handleChange}
                />
                <select
                    name="Role"
                    value={formData.Role}
                    onChange={handleChange}>
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                </select>
                <input
                    type="text"
                    name="Username"
                    value={formData.Username}
                    onChange={handleChange}
                    placeholder="Username"
                    disabled
                />
                <input
                    type="password"
                    name="Password"
                    value={formData.Password}
                    onChange={handleChange}
                    placeholder="Password"
                />
                <div className="modal-actions">
                    <button className='save-btn' type="submit">Save Changes</button>
                    <button className='cancel-btn' type="button" onClick={onClose}>Cancel</button>
                </div>
            </form>
        </div>
    );
};

export default UpdateUser;