const express = require("express");
const { getAllPublicRoutines, createRoutine, getRoutineById, updateRoutine } = require("../db");
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
  const { name, goal, isPublic } = req.body;
  const creatorId = req.user.id
  
  try {
    if (req.user){
    const newRoutine = await createRoutine({creatorId,isPublic,name, goal});
    res.send(newRoutine);
    }else {
      next({error:"UnauthorizedError",
      message:"You must be logged in to perform this action",
      name:"UnauthorizedUser"})
    }

  } catch (error) {
    next();
  }
});
// PATCH /api/routines/:routineId
router.patch("/:routineId",requireUser, async (req,res,next) => {
  const {routineId} = req.params
  const {isPublic,name,goal} = req.body
  const updateFields = {}

  if (isPublic){
    updateFields.isPublic = isPublic
  }
  if (name){
    updateFields.name = name
  }
  if (goal){
    updateFields.goal = goal
  }

  try {
    const originalRoutine = await getRoutineById(routineId)
    console.log(originalRoutine)
    if (req.user && originalRoutine.creatorId == req.user.id){
      const updatedRoutine = await updateRoutine({id:routineId, fields:updateFields})

    }else{
      res.send(Error.status(403))
    }
  } catch (error) {
    next();
  }



})

// DELETE /api/routines/:routineId

// POST /api/routines/:routineId/activities

module.exports = router;
