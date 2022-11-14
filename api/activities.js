const express = require('express');
const id = require('faker/lib/locales/id_ID');
const { getAllActivities, createActivity, getActivityByName, getPublicRoutinesByActivity } = require('../db');
const { requireUser } = require('./utils');
const router = express.Router();

// GET /api/activities/:activityId/routines
router.get("/:activityId/routines", async (req,res,next) => {

    const {activityId} = req.params;
    try{
        const routinesWithActivity = await getPublicRoutinesByActivity({id: activityId})

        console.log(activityId, "activityId")
        console.log(routinesWithActivity, "i am the thing")

    // if (!id) {
    //     res.send({
    //         error: "ActivityNotFound",
    //         message: `Activity ${activityId} not found`,
    //         name: "ActivityNotFound",
    //     })
    // }
        
        res.send(routinesWithActivity)
    } catch (error) {
        throw (error)
    }
});
// GET /api/activities
router.get("/", async (req, res, next) => {
  try{  
   const allActivities = await getAllActivities() 
   
    res.send(allActivities)
  }catch (error) {
    next()
  }
});
 
// POST /api/activities
router.post("/", requireUser, async (req, res, next) => {
    const {name, description} = req.body;
try{
    const activity = await getActivityByName(name)
    
    
    if (activity) {
        res.send({
            error: "ErrorActivityExists",
            message: `An activity with name ${name} already exists`,
            name: "ActivityExists",
        })
        
    }
    const newActivity = await createActivity({name, description})

    res.send(newActivity)
}catch (error) {
    throw error;
}
})
// PATCH /api/activities/:activityId
// router.patch("/:activityId", requireUser, async (req, res, next) => {
//     const {name, description} = req.params;

// })


module.exports = router;
