import React, { useState, useEffect } from 'react';
import './Tasks.css';

function Tasks() {
  const [tasks, setTasks] = useState([]); //variable for retrieving tasks
  const [isWidgetVisible, setIsWidgetVisible] = useState(false); // Track visibility
  const [isModalVisible, setIsModalVisible] = useState(false); // Track modal visibility
  const [newTask, setNewTask] = useState({ //variable for creating new task
    task: '',
    dueDate: '',
    dateMade: new Date().toISOString().split('T')[0],
    userId: sessionStorage.getItem("userId"),
    isComplete: false,
  });
  //Get tasks function to retrieve tasks
  const getTasks = async () => {
    try {
      const userId = sessionStorage.getItem("userId");
      const response = await fetch(
        `http://localhost:8080/api/tasks?userId=${userId}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Task retrieval failed");

      setTasks(data.tasks); //Update the tasks state with the fetched tasks
    } catch (err) {
      console.error("Error getting tasks", err);
    }
  };

  //Fetch tasks initially on mount
  useEffect(() => {
    getTasks();
  }, []);

  //function to adjust widget visibility
  const toggleWidget = () => {
    setIsWidgetVisible(!isWidgetVisible);
  };
  //API call to mark task completed
  const markTaskAsCompleted = async (taskId) => {
    try {
      const response = await fetch(`http://localhost:8080/api/tasks/${taskId}/complete`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Task completed failed");
      getTasks();
    } catch (err) {
      console.error("error marking task completed", err);
    }
  };
  //function to handle when edits are made inside modal
  const handleModalChange = (e) => {
    const { name, value } = e.target;
    setNewTask((prevTask) => ({
      ...prevTask,
      [name]: value,
    }));
  };
  //API call to create a new task
  const handleTaskCreation = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8080/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTask),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Task creation failed");
      setIsModalVisible(false); //Close the modal after task creation
      getTasks();
    } catch (err) {
      console.error("error creating task", err);
    }
  };

  return (
    <div>
      <button onClick={toggleWidget} className="show-task-button">
        Tasks
      </button>
      {isWidgetVisible && (
        <div className={`widget-container ${isWidgetVisible ? "show" : ""}`}>
          <div className="widget-header">
            <h1>My Tasks</h1>
          </div>
          {tasks.length === 0 ? (
            <p className="no-tasks">You have no tasks.</p>
          ) : (
            <div className="tasks-list">
              {tasks.map((task) => (
                <div className="task-widget" key={task.taskId}>
                  <h3 className="task-title">{task.task}</h3>
                  <p className="task-details">
                    <strong>Due Date:</strong> {new Date(task.dueDate).toISOString().split("T")[0] || "N/A"} <br />
                    <strong>Created On:</strong> {new Date(task.dateMade).toISOString().split("T")[0] || "N/A"}
                  </p>
                  <button className="mark-completed-button" onClick={() => markTaskAsCompleted(task.taskId)}>
                    Mark Completed
                  </button>
                </div>
              ))}
            </div>
          )}
          <button onClick={() => setIsModalVisible(true)} className="create-task-button-inside-widget">
            Create Task
          </button>
        </div>
      )}

      {isModalVisible && (
        <div className="modal">
          <h3>Create a Task</h3>
          <form onSubmit={handleTaskCreation}>
            <div>
              <label>Task Description: </label>
              <input
                type="text"
                name="task"
                value={newTask.task}
                onChange={handleModalChange}
                placeholder="Task description"
                required
              />
            </div>
            <div>
              <label>Due Date: </label>
              <input
                type="date"
                name="dueDate"
                value={newTask.dueDate}
                onChange={handleModalChange}
                required
              />
            </div>
            <div className="modal-actions">
              <button type="submit" className="save-btn">
                Save Task
              </button>
              <button
                type="button"
                className="cancel-btn"
                onClick={() => setIsModalVisible(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default Tasks;
