import React, { useState, useEffect, useCallback } from 'react';
import './Tasks.css';
import { getTasks, updateTaskComplete, createTask } from './api/api.js'
import { useAuth } from './AuthContext.js';

function Tasks() {
	const [error, setError] = useState('');
	const [tasks, setTasks] = useState([]); //variable for retrieving tasks
	const {userId} = useAuth(); //take userId from AuthContext
	const [isWidgetVisible, setIsWidgetVisible] = useState(false); //Track widget visibility
	const [isModalVisible, setIsModalVisible] = useState(false); //Track modal visibility
	const [newTask, setNewTask] = useState({ //variable for creating new task
		task: '',
		dueDate: '',
		dateMade: new Date().toISOString().split('T')[0],
		userId: userId,
		isComplete: false,
	});


	const fetchTasks = useCallback(async () => { //useCallback to to stop infinite renders from userId call
		try {
			const data = await getTasks(userId);
			setTasks(data.tasks);
		} catch (err) {
			setError(err.message);
		}
	}, [userId]); 
	
	useEffect(() => {
		fetchTasks();
	}, [fetchTasks]);


	//function to mark task complete
	const handleTaskComplete = async (taskId) => {
		try {
			await updateTaskComplete(taskId); //send taskId to api file
			fetchTasks(); //load tasks once db responds
		} catch (err) {
			setError(err.message);
		}
	};


	//function to create a new task
	const handleCreateTask = async (e) => {
		e.preventDefault();
		try {
			await createTask(newTask); //send new task data to api file
			fetchTasks();
			setIsModalVisible(false);
		} catch (err) {
			setError(err.message);
		}
	};

	//simple function to toggle visibility of the task widget
	const toggleWidget = () => {
		setIsWidgetVisible(!isWidgetVisible);
	};


	//function to handle when edits are made inside modal
	const handleModalChange = (e) => {
		const { name, value } = e.target;
		setNewTask((prevTask) => ({ //
			...prevTask,
			[name]: value,
		}));
	};


	return (
		<div>
			<button onClick={toggleWidget} className='show-task-button'>
				Tasks
			</button>
			{isWidgetVisible && (
				<div className={`widget-container ${isWidgetVisible ? 'show' : ''}`}>
					<div className='widget-header'>
						<h1>My Tasks</h1>
					</div>
					{error && <p className='error-message'>{error}</p>}
					{tasks.length === 0 ? (
						<p className='no-tasks'>You have no tasks.</p>
					) : (
						<div className='tasks-list'>
							{tasks.map((task) => (
								<div className='task-widget' key={task.taskId}>
									<h3 className='task-title'>{task.task}</h3>
									<p className='task-details'>
										<strong>Due Date:</strong> {new Date(task.dueDate).toISOString().split('T')[0] || 'N/A'} <br />
										<strong>Created On:</strong> {new Date(task.dateMade).toISOString().split('T')[0] || 'N/A'}
									</p>
									<button className='mark-completed-button' onClick={() => handleTaskComplete(task.taskId)}>
										Mark Completed
									</button>
								</div>
							))}
						</div>
					)}
					<button onClick={() => setIsModalVisible(true)} className='create-task-button-inside-widget'>
						Create Task
					</button>
				</div>
			)}

			{isModalVisible && (
				<div className='modal'>
					<h3>Create a Task</h3>
					<form onSubmit={handleCreateTask}>
						<div>
							<label>Task Description: </label>
							<input
								type='text'
								name='task'
								value={newTask.task}
								onChange={handleModalChange}
								placeholder='Task description'
								required
							/>
						</div>
						<div>
							<label>Due Date: </label>
							<input
								type='date'
								name='dueDate'
								value={newTask.dueDate}
								onChange={handleModalChange}
								required
							/>
						</div>
						<div className='modal-actions'>
							<button type='submit' className='save-btn'>
								Save Task
							</button>
							<button
								type='button'
								className='cancel-btn'
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
