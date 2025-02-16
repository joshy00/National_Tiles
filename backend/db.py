from flask import Flask, request, jsonify
from flask_cors import CORS
from mysql.connector import pooling
from datetime import datetime
app = Flask(__name__)
#cors to allow ease of use between different ports
CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}})
#Database connfig
dbconfig = {
    "host": "localhost",
    "user": "root",
    "password": "",
    "database": "national_tiles"
}

#simple db_pool for multiple connections
db_pool = pooling.MySQLConnectionPool(
    pool_name="mypool",
    pool_size=5, 
    **dbconfig
    )
#login API
@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    query = "SELECT * FROM users WHERE username = %s AND password = %s"
    
    try:
        db_connection = db_pool.get_connection()
        cursor = db_connection.cursor(dictionary=True)
        cursor.execute(query, (username, password))
        user = cursor.fetchone()

    except Exception as e:
        return jsonify({"message": f"Error during login: {str(e)}", "status": "error"}), 500

    finally:
        #Ensure cursor and db is closed
        cursor.close()
        db_connection.close()

    if user:
        return jsonify({"message": "Login successful", "role": user["Role"], "userId": user["UserId"]}), 200
    else:
        return jsonify({"message": "Invalid credentials", "status": "error"}), 401

#getTasks API
@app.route('/api/tasks', methods=['GET'])
def getTasks():
    userId = request.args.get("userId")
    query = "SELECT * FROM tasks WHERE userId = %s AND DATE(dueDate) <= CURDATE() AND isComplete = FALSE"
    
    if not userId:
        return jsonify({"message": "userId is required", "status": "error"}), 400
    try:
        db_connection = db_pool.get_connection()
        cursor = db_connection.cursor(dictionary=True)
        cursor.execute(query, (userId,))
        tasks = cursor.fetchall()
        return jsonify({"tasks": tasks}), 200
    
    except Exception as e:
        return jsonify({"message": f"Error retrieving tasks: {str(e)}", "status": "error"}), 500
    
    finally:
        cursor.close()
        db_connection.close()

#markTaskCompleted API
@app.route('/api/tasks/<int:taskId>/complete', methods=['PATCH'])
def markTaskCompleted(taskId):
    query = "UPDATE tasks SET isComplete = 1 WHERE taskId = %s"

    try:
        db_connection = db_pool.get_connection()
        cursor = db_connection.cursor(dictionary=True) 
        cursor.execute(query, (taskId,))
        db_connection.commit()
        return jsonify({"message": "Task marked completed"}), 200
    
    except Exception as e:
        return jsonify({"message": f"Error marking task complete {str(e)}", "status": "error"}), 500
    
    finally:
        cursor.close()
        db_connection.close()

#getUsers API
@app.route("/api/users", methods = ["GET"])
def getUsers():
    query = "SELECT * FROM users"
    
    try:
        db_connection = db_pool.get_connection()
        cursor = db_connection.cursor(dictionary=True)
        cursor.execute(query)
        users = cursor.fetchall()
        return jsonify({"users": users}), 200
    except Exception as e:
        return jsonify({"message": f"Error retrieving users {str(e)}", "status": "error"}), 500
    finally:
        cursor.close()
        db_connection.close()

#createUser API
@app.route("/api/users", methods = ["POST"])
def createUser():
    data = request.get_json()
    FirstName = data['FirstName']
    LastName = data['LastName']
    Dob = data['Dob']
    Role = data['Role']
    Username = data['Username']
    Password = data['Password']
    query = "INSERT INTO users (FirstName, LastName, Dob, Role, Username, Password) VALUES (%s, %s, %s, %s, %s, %s)"
    
    try:
        db_connection = db_pool.get_connection()
        cursor = db_connection.cursor(dictionary=True)
        cursor.execute(query, (FirstName, LastName, Dob, Role, Username, Password))
        db_connection.commit()
        return jsonify({"message": "user creation successful"}), 200
    except Exception as e:
        return jsonify({"message": f"Error creating user {str(e)}", "status": "error"}), 500
    finally:
        cursor.close() #ensure cursor and db_connection are closed so connection pool is replenished
        db_connection.close()

#deleteUser API
@app.route('/api/users/<int:UserId>', methods=['DELETE'])
def deleteUser(UserId):
    query = "DELETE FROM users WHERE UserId = %s"
    
    try:
        db_connection = db_pool.get_connection()
        cursor = db_connection.cursor(dictionary=True)
        cursor.execute(query, (UserId,))
        db_connection.commit()
        return jsonify({"message": "User deleted successfully"}), 200
    except Exception as e:
        return jsonify({"message": f"Error deleting user {str(e)}", "status": "error"}), 500
    finally:
        cursor.close()
        db_connection.close()
    

#updateUser API
@app.route('/api/users/<int:UserId>', methods=['PATCH'])
def updateUser(UserId):
    data = request.get_json()
    fields = ['FirstName', 'LastName', 'Dob', 'Role', 'Username', 'Password'] #Possible fields user can edit
    fieldsToChange = [] #array to hold the fields the user did change
    values = [] #values of those fields

    for field in fields:
        if field in data and data[field]:
            fieldsToChange.append(f"{field} = %s") #attach field = %s to the fields to change array
            values.append(data[field]) #get the value associated with field in data sent from frontend

    if not fieldsToChange:
        return jsonify({"message": "No fields to update"}), 400

    values.append(UserId)
    query = f"UPDATE users SET {', '.join(fieldsToChange)} WHERE UserId = %s"

    try:
        db_connection = db_pool.get_connection()
        cursor = db_connection.cursor()
        cursor.execute(query, tuple(values)) #insert updated values into the query
        db_connection.commit()

        return jsonify({"message": "User updated successfully"}), 200
    except Exception as e:
        return jsonify({"message": f"Error updating user: {str(e)}", "status": "error"}), 500
    finally:
        cursor.close()
        db_connection.close()


@app.route("/api/tasks", methods=["POST"])
def createTask():
    data = request.get_json()
    task_description = data['task']
    due_date = data['dueDate']
    user_id = data['userId']
    date_made = datetime.now().strftime("%Y-%m-%d")  # Today's date
    is_complete = False  # Default value for isComplete

    # SQL query to insert a new task into the database
    query = "INSERT INTO tasks (task, dueDate, dateMade, userId, isComplete) VALUES (%s, %s, %s, %s, %s)"
    try:
        db_connection = db_pool.get_connection()
        cursor = db_connection.cursor(dictionary=True)
        cursor.execute(query, (task_description, due_date, date_made, user_id, is_complete))
        db_connection.commit()
        return jsonify({"message": "Task created successfully"}), 200
    except Exception as e:
        return jsonify({"message": f"Error creating task: {str(e)}", "status": "error"}), 500
    finally:
        cursor.close()
        db_connection.close()



if __name__ == '__main__':
    app.run(debug=True, port=8080)