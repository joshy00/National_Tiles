const BASE_URL = 'http://localhost:8080/api';

//login api call
const loginUser = async (username, password) => {
  try {
    const response = await fetch(`${BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      const errorData = await response.json(); //Try to parse error message from server
      throw new Error(errorData.message || 'Login failed'); //Throw with server message or generic
    }

    const data = await response.json();
    return data; //Return the successful login data
  } catch (err) {
    console.error('Error during login:', err); //Log the error for debugging
    throw err; // Re-throw the error to be handled by the component
  }
};

export { loginUser };

//getTasks API call
const getTasks = async (userId) => {
  try {
    const response = await fetch(`${BASE_URL}/tasks?userId=${userId}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    }
    );

    if (!response.ok) {
      const errorData = await response.json(); // Try to parse error message from server
      throw new Error(errorData.message || 'Task retrieval failed'); // Throw with server message or generic
    }

    const data = await response.json();
    return data; //return tasks back to component
  } catch (err) {
    console.error('Error getting tasks', err);
    throw err;
  }
};

export { getTasks };

//updateTaskComplete API call
const updateTaskComplete = async (taskId) => {
  try {
    const response = await fetch(`${BASE_URL}/tasks/${taskId}/complete`, { //use task id to mark task complete
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Task retrieval failed');
    }
  } catch (err) {
    console.error('Error marking task complete', err);
    throw err;
  }
};

export { updateTaskComplete };


//createTask API call
const createTask = async (newTask) => {

  try {
    const response = await fetch(`${BASE_URL}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newTask), //send new task data
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Task creation failed');
    }
  }
  catch (err) {
    console.log('error creating task', err)
    throw err;
  }
};

export { createTask };


//getUsers API call
const getUsers = async () => {

  try {
    const response = await fetch(`${BASE_URL}/users`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }, //get all users from db
    }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'users retrieval failed.');
    }

    const data = await response.json();
    return data; //pass users back
  } catch (err) {
    console.log('error retrieving users', err)
    throw err;
  }
};

export { getUsers };

//createUser API call
const createUser = async (newUser) => {
  try {
    const response = await fetch(`${BASE_URL}/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newUser), //send new user data to db
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'user creation failed.');
    }
  } catch (err) {
    console.log("error creating user.", err);
    throw err;
  }
}

export { createUser };

//updateUser API call
const updateUser = async (updatedUser) => {
  try {
    const response = await fetch(`${BASE_URL}/users/${updatedUser.UserId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedUser), //send updated user data to db
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'user update failed.');
    }
  } catch (err) {
    console.log('error updating user.', err);
    throw err;
  }
};

export { updateUser };

//deleteUser API call
const deleteUser = async (UserId) => {
  try {
    const response = await fetch(`${BASE_URL}/users/${UserId}`, { //send userId to db to be deleted
      method: "DELETE",
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'user delete failed.');
    }
  } catch (err) {
    console.log('error deleting user.', err);
    throw err;
  }
};

export { deleteUser };
