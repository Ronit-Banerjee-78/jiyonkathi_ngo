import express from 'express';
import { fetchProjectsList, createNewProject } from '../services/projectService.js';

const router = express.Router();

// GET /api/projects
router.get('/', async (req, res) => {
  try {
    const projects = await fetchProjectsList();
    res.json({ success: true, data: projects });
  } catch (error) {
    console.error("Error in projectController GET:", error);
    res.status(500).json({ success: false, error: 'Database error' });
  }
});

// POST /api/projects
router.post('/', async (req, res) => {
  try {
    const newProject = await createNewProject(req.body);
    res.status(201).json({ success: true, data: newProject });
  } catch (error) {
    console.error("Error in projectController POST:", error);
    res.status(400).json({ success: false, error: error.message });
  }
});

export { router as projectRoutes };
