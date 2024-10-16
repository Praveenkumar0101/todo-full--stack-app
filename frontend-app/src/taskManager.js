import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';
import './taskManager.css';
import { baseURL } from '.';

function TaskManager() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({
    task_name: '',
    description: '',
    status: 'Not completed',
    priority: 'Low',
    deadline: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [currentTaskId, setCurrentTaskId] = useState(null);
  const [showAddTask, setShowAddTask] = useState(false);

  // Fetch tasks from backend
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = () => {
    axios.get(`${baseURL}/tasks`)
      .then(response => {
        setTasks(response.data);
      })
      .catch(error => console.log(error));
  };

  const handleAddTask = () => {
    axios.post(`${baseURL}/tasks`, newTask)
      .then(response => {
        setTasks([...tasks, response.data]);
        resetForm();
      })
      .catch(error => console.log(error));
  };

  const handleUpdateTask = () => {
    axios.put(`${baseURL}/tasks/${currentTaskId}`, newTask)
      .then(response => {
        const updatedTasks = tasks.map(task =>
          task.id === currentTaskId ? response.data : task
        );
        setTasks(updatedTasks);
        resetForm();
      })
      .catch(error => console.log(error));
  };

  const handleDeleteTask = (id) => {
    axios.delete(`${baseURL}/tasks/${id}`)
      .then(() => {
        setTasks(tasks.filter(task => task.id !== id));
      })
      .catch(error => console.log(error));
  };

  const resetForm = () => {
    setNewTask({ task_name: '', description: '', status: 'Not completed', priority: 'Low', deadline: '' });
    setShowAddTask(false);
    setIsEditing(false);
    setCurrentTaskId(null);
  };

  const startEdit = (task) => {
    setNewTask({
      task_name: task.task_name,
      description: task.description,
      status: task.status,
      priority: task.priority,
      deadline: task.deadline,
    });
    setCurrentTaskId(task.id);
    setIsEditing(true);
    setShowAddTask(true);
  };

  return (
    <div className="admin-container">
      <div className="main-content">
        <div className="header">
          <div className="header-title">Tasks</div>
          <div className="profile-icon">👤</div>
        </div>
        <div className="dashboard-welcome">
          <button className="add-task-btn" onClick={() => setShowAddTask(true)}>Add Task</button>
          {showAddTask && (
            <div className="add-task-form">
              <input
                type="text"
                placeholder="Task Name"
                value={newTask.task_name}
                onChange={(e) => setNewTask({ ...newTask, task_name: e.target.value })}
              />
              <textarea
                placeholder="Description"
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
              />
              <select
                value={newTask.status}
                onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}
              >
                <option value="Not completed">Not completed</option>
                <option value="In progress">In progress</option>
                <option value="Completed">Completed</option>
              </select>
              <select
                value={newTask.priority}
                onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
              <input
                type="date"
                value={newTask.deadline}
                onChange={(e) => setNewTask({ ...newTask, deadline: e.target.value })}
              />
              <button onClick={isEditing ? handleUpdateTask : handleAddTask}>
                {isEditing ? 'Update' : 'Submit'}
              </button>
              <button onClick={resetForm}>Cancel</button>
            </div>
          )}

          <table className="task-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Task Name</th>
                <th>Description</th>
                <th>Status</th>
                <th>Priority</th>
                <th>Deadline</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task,index) => (
                <tr key={task.id}>
                  <td>{index+1}</td>
                  <td>{task.task_name}</td>
                  <td>{task.description}</td>
                  <td className={
                      task.status === 'Completed'
                        ? 'status-completed'
                        : task.status === 'In progress'
                        ? 'status-in-progress'
                        : 'status-not-completed'
                    }>
                    {task.status}
                  </td>
                  <td className={
                      task.priority === 'High'
                        ? 'priority-high'
                        : task.priority === 'Medium'
                        ? 'priority-medium'
                        : 'priority-low'
                    }>
                    {task.priority}
                  </td>
                  <td>{task.deadline}</td>
                  <td>
                    <button onClick={() => startEdit(task)}>  Edit</button>
                    <button onClick={() => handleDeleteTask(task.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default TaskManager;
