const express = require("express");
const { getAllPublicRoutines, createRoutine } = require("../db");
const { requireUser } = require("./utils");
const router = express.Router();

// GET /api/routines
router.get("/", async (req, res, next) => {
  try {
    const allPublicRoutines = await getAllPublicRoutines();

    res.send(allPublicRoutines);
  } catch (error) {
    next();
  }
});
// POST /api/routines
router.post("/", requireUser, async (req, res, next) => {
  const { name, goal, isPublic, creatorId } = req.body;

  try {
    const newRoutine = await createRoutine({name, goal, isPublic, creatorId});

    res.send(newRoutine);
  } catch (error) {
    throw error;
  }
});
// PATCH /api/routines/:routineId

// DELETE /api/routines/:routineId

// POST /api/routines/:routineId/activities

module.exports = router;
