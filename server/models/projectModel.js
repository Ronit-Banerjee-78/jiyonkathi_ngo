import pool, { isDbConnected } from './db.js';

let inMemoryProjects = [];
let nextProjectId = 1;

export const getAllProjects = async () => {
  if (!isDbConnected) {
    return inMemoryProjects;
  }
  try {
    const result = await pool.query('SELECT * FROM projects ORDER BY id ASC');
    return result.rows;
  } catch (error) {
    console.error('Error fetching from DB, returning memory projects:', error.message);
    return inMemoryProjects;
  }
};

export const addProject = async (title, targetAmount) => {
  if (!isDbConnected) {
    const newProject = { id: nextProjectId++, title, target_amount: targetAmount, created_at: new Date() };
    inMemoryProjects.push(newProject);
    return newProject;
  }
  try {
    const result = await pool.query(
      'INSERT INTO projects (title, target_amount) VALUES ($1, $2) RETURNING *',
      [title, targetAmount]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Error inserting project into DB, falling back to memory:', error.message);
    const newProject = { id: nextProjectId++, title, target_amount: targetAmount, created_at: new Date() };
    inMemoryProjects.push(newProject);
    return newProject;
  }
};
