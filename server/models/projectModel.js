import pool, { isDbConnected } from './db.js';
import { DEFAULT_PROJECTS_DATA } from './seedData.js';

let inMemoryProjects = DEFAULT_PROJECTS_DATA.map((p, idx) => ({
  id: idx + 1,
  title: p.title,
  target_amount: p.target_amount,
  created_at: new Date(),
}));
let nextProjectId = 5;

export const getAllProjects = async () => {
  if (!isDbConnected) {
    return inMemoryProjects;
  }
  try {
    const result = await pool.query('SELECT * FROM projects ORDER BY id ASC');
    if (result.rows.length === 0) {
      for (const p of DEFAULT_PROJECTS_DATA) {
        await pool.query('INSERT INTO projects (title, target_amount) VALUES ($1, $2)', [p.title, p.target_amount]);
      }
      const seeded = await pool.query('SELECT * FROM projects ORDER BY id ASC');
      return seeded.rows;
    }
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
