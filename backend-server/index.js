const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection({
  host: 'sql12.freesqldatabase.com',
  user: 'sql12741211', 
  password: 'xe85KHEqXk', 
  database: 'sql12741211', 
});


db.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL database.');

  
  const createTasksTable = `
    CREATE TABLE IF NOT EXISTS tasks (
      id INT AUTO_INCREMENT PRIMARY KEY,
      task_name VARCHAR(255) NOT NULL,
      description TEXT,
      status ENUM('Not completed', 'In progress', 'Completed') DEFAULT 'Not completed',
      priority ENUM('Low', 'Medium', 'High') DEFAULT 'Low',
      deadline DATE
    );
  `;

  db.query(createTasksTable, (error) => {
    if (error) {
      console.error('Error creating tasks table:', error);
      throw error;
    }
    console.log('Tasks table ensured to exist.');
  });
});


app.get('/tasks', (req, res) => {
  const sql = 'SELECT * FROM tasks'; 

  db.query(sql, (error, results) => {
    if (error) {
      console.error('Error retrieving data:', error);
      return res.status(500).send('Server Error');
    }
    res.status(200).json(results);
  });
});


app.post('/tasks', (req, res) => {
  const { task_name, description, status, priority, deadline } = req.body;

  const sql = 'INSERT INTO tasks (task_name, description, status, priority, deadline) VALUES (?, ?, ?, ?, ?)';
  const values = [task_name, description, status, priority, deadline];

  db.query(sql, values, (error, results) => {
    if (error) {
      console.error('Error inserting data:', error);
      return res.status(500).send('Server Error');
    }
    res.status(201).send({ id: results.insertId, task_name, description, status, priority, deadline });
  });
});


app.put('/tasks/:id', (req, res) => {
  const { id } = req.params;
  const { task_name, description, status, priority, deadline } = req.body;

  const sql = 'UPDATE tasks SET task_name = ?, description = ?, status = ?, priority = ?, deadline = ? WHERE id = ?';
  const values = [task_name, description, status, priority, deadline, id];

  db.query(sql, values, (error, results) => {
    if (error) {
      console.error('Error updating data:', error);
      return res.status(500).send('Server Error');
    }
    res.status(200).send({ id, task_name, description, status, priority, deadline });
  });
});


app.delete('/tasks/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM tasks WHERE id = ?';

  db.query(sql, [id], (error, results) => {
    if (error) {
      console.error('Error deleting task:', error);
      return res.status(500).send('Server Error');
    }
    res.status(204).send(); 
  });
});


app.delete('/tasks', (req, res) => {
  const deleteTasksSql = 'DELETE FROM tasks';
  const resetAutoIncrementSql = 'ALTER TABLE tasks AUTO_INCREMENT = 1';


  db.query(deleteTasksSql, (error) => {
    if (error) {
      console.error('Error deleting all tasks:', error);
      return res.status(500).send('Server Error');
    }
    console.log('All tasks deleted successfully.');
    

    db.query(resetAutoIncrementSql, (resetError) => {
      if (resetError) {
        console.error('Error resetting AUTO_INCREMENT:', resetError);
        return res.status(500).send('Server Error');
      }
      console.log('AUTO_INCREMENT reset successfully.');
      res.status(204).send(); 
    });
  });
});


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
