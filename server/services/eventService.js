import {
  getAllEvents,
  addEvent,
  updateEvent,
  deleteEvent,
} from "../models/eventModel.js";
import { addProject } from "../models/projectModel.js";

export const fetchEventsList = async () => {
  return await getAllEvents();
};

export const createNewEvent = async (data) => {
  if (!data.title) {
    throw new Error("Missing required field: title");
  }
  return await addEvent(data);
};

export const editEvent = async (id, data) => {
  return await updateEvent(id, data);
};

export const removeEvent = async (id) => {
  return await deleteEvent(id);
};

export const promoteEventToWork = async (id, projectDetails = {}) => {
  const events = await getAllEvents();
  const event = events.find((e) => String(e.id) === String(id));

  if (!event) {
    throw new Error("Event not found");
  }

  const workRef = event.our_work_ref || "welf-" + Date.now();
  const updatedEvent = await updateEvent(id, {
    status: "completed",
    our_work_ref: workRef,
  });

  // Create a corresponding project entry in database or return project structure
  const projectTitle = projectDetails.title || event.title;
  const targetAmount = projectDetails.targetAmount || 100000;

  let newProject = null;
  try {
    newProject = await addProject(projectTitle, targetAmount);
  } catch (err) {
    console.warn("Project creation on promotion warning:", err.message);
  }

  return {
    success: true,
    event: updatedEvent,
    project: newProject,
    workRef: workRef,
  };
};
