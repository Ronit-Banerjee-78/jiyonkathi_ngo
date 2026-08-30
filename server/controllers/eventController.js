import express from "express";
import {
  fetchEventsList,
  createNewEvent,
  editEvent,
  removeEvent,
  promoteEventToWork,
} from "../services/eventService.js";

const router = express.Router();

// GET /api/events
router.get("/", async (req, res) => {
  try {
    const events = await fetchEventsList();
    res.json({ success: true, events });
  } catch (error) {
    console.error("Error in eventController GET:", error);
    res.status(500).json({ success: false, error: "Database error" });
  }
});

// POST /api/events
router.post("/", async (req, res) => {
  try {
    const newEvent = await createNewEvent(req.body);
    res.status(201).json({ success: true, event: newEvent });
  } catch (error) {
    console.error("Error in eventController POST:", error);
    res.status(400).json({ success: false, error: error.message });
  }
});

// PUT /api/events/:id
router.put("/:id", async (req, res) => {
  try {
    const updated = await editEvent(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, error: "Event not found" });
    }
    res.json({ success: true, event: updated });
  } catch (error) {
    console.error("Error in eventController PUT:", error);
    res.status(400).json({ success: false, error: error.message });
  }
});

// DELETE /api/events/:id
router.delete("/:id", async (req, res) => {
  try {
    await removeEvent(req.params.id);
    res.json({ success: true, message: "Event deleted successfully" });
  } catch (error) {
    console.error("Error in eventController DELETE:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/events/:id/promote
router.post("/:id/promote", async (req, res) => {
  try {
    const result = await promoteEventToWork(req.params.id, req.body);
    res.json({ success: true, data: result });
  } catch (error) {
    console.error("Error in eventController PROMOTE:", error);
    res.status(400).json({ success: false, error: error.message });
  }
});

export { router as eventRoutes };
