const express = require('express');
const { getAllActivities, createActivity, getActivityByName, getPublicRoutinesByActivity, getActivityById, updateActivity } = require('../db');
const { requireUser } = require('./utils');
const router = express.Router();

// GET /api/activities/:activityId/routines
router.get("/:activityId/routines", async (req,res,next) => {


    const {activityId} = req.params;
    const routinesWithActivity = await getPublicRoutinesByActivity({id: activityId})
    try{
    if (routinesWithActivity.length  == 0){
            res.send({
                error: "ActivityNotFound",
                message: `Activity ${activityId} not found`,
                name: "ActivityNotFound"
    })
    }


    if (routinesWithActivity) {
        res.send(routinesWithActivity)
        
    }
        
    } catch (error) {
        next();
    }
});
// GET /api/activities
router.get("/", async (req, res, next) => {
  try{  
   const allActivities = await getAllActivities() 
   
    res.send(allActivities)
  }catch (error) {
    next();
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
    next();
}
})
// PATCH /api/activities/:activityId
router.patch("/:activityId", requireUser, async (req, res, next) => {
    const {activityId} = req.params;
    const {name,description} = req.body
    const updateFields = {}

    if (name){
        updateFields.name = name
    }

    if (description){
        updateFields.description = description
    }
    console.log(activityId, "77 log")
    try {
        const originalActivity = await getActivityById(activityId)

        if (!originalActivity){
            res.send({error:"NonExistingActivity",
            message:`Activity ${activityId} not found`,
            name:"NonExistingActivity"})
        }

        console.log(originalActivity, "this is the old one")
       
        

        const existingActivity = await getActivityByName(name)
        // for (let i = 0; i <= existingActivities.length; i++) {
        //     existingName = 
        // }
        if (existingActivity){
            res.send({error:"ActivityExists",
                      message:`An activity with name ${name} already exists`,
                      name:"ActivityExists"})
        }
        console.log(existingActivity, "exists")
        console.log(updateFields, "fields")
        // if (!existingActivity){
            const updatedActivity = await updateActivity({id: activityId, fields: updateFields})
            
            res.send({activity:updatedActivity})
        // }else {
        //     next({error:"UnauthorizedError",
        //     message:`You are not authorized to perform this action`,
        //     name:"UnauthorizedUser"})
        // }




    } catch (error) {
        next();
    }


})


module.exports = router;
