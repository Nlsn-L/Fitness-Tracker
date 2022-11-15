const client = require("./client");
const { getUser } = require("./users");

// database functions

async function getAllActivities(){
try {
  const {rows} = await client.query(`
  SELECT *
  FROM activities;
  `);

  return rows;
} catch (error) {
  console.error("Error getting all activities")
  throw error;
}

}

async function getActivityById(id) {
  try {
    const {rows: [activity] } = await client.query(
      `SELECT *
       FROM activities
       WHERE id = $1
    `,[id]);

    return activity;

  } catch (error) {
    console.error("Error getting activity by Id!")
    throw error
  }
}

async function getActivityByName(name) {
  
  try {
    const {rows: [activity]} = await client.query(`
      SELECT *
      FROM activities    
      WHERE name=$1
    `,[name])

    return activity
  } catch (error) {
    console.error("Error getting activity by name!")
    throw error;
  }

}

// select and return an array of all activities
// async function attachActivitiesToRoutines(routines) {
// }

// return the new activity
async function createActivity({ name, description }) {
  try {
    const {rows: [activity]} = await client.query(`
    INSERT INTO activities(name,description)
    VALUES ($1,$2)
    ON CONFLICT (name) DO NOTHING
    RETURNING *;
    `,[name,description])
   
    return activity
  } catch (error) {
    console.error("Error creating and activity!")
    throw error;
  }


}

// don't try to update the id
// do update the name and description
// return the updated activity
async function updateActivity({ id, ...fields }) {
    const setString = Object.keys(fields).map(
      (values,index) => {
        return `"${values}" = $${index + 1}`
      }
    ).join(", ")

      if (setString.length === 0){
        return;
      }
    try{
      const {rows: [result]} = await client.query(`
      UPDATE activities
      SET ${setString}   
      WHERE id=${id}
      RETURNING *;   
      `,Object.values(fields))
      return result
    }catch (error) {
      // console.error("Error updating activity!")
      throw error;
  }

}

async function attachActivitiesToRoutines(routines) {
  // no side effects
  const routinesToReturn = [...routines];
  const binds = routines.map((_, index) => `$${index + 1}`).join(', ');
  const routineIds = routines.map(routine => routine.id);
  if (!routineIds?.length) return [];
  
  try {
    // get the activities, JOIN with routine_activities (so we can get a routineId), and only those that have those routine ids on the routine_activities join
    const { rows: activities } = await client.query(`
      SELECT activities.*, routine_activities.duration, routine_activities.count, routine_activities.id AS "routineActivityId", routine_activities."routineId"
      FROM activities 
      JOIN routine_activities ON routine_activities."activityId" = activities.id
      WHERE routine_activities."routineId" IN (${ binds });
    `, routineIds);

    // loop over the routines
    for(const routine of routinesToReturn) {
      // filter the activities to only include those that have this routineId
      const activitiesToAdd = activities.filter(activity => activity.routineId === routine.id);
      // attach the activities to each single routine
      routine.activities = activitiesToAdd;
    }
    return routinesToReturn;
  } catch (error) {
    console.error("Error attaching activities to routines!")
    throw error;
  }
}



module.exports = {
  getAllActivities,
  getActivityById,
  getActivityByName,
  attachActivitiesToRoutines,
  createActivity,
  updateActivity,
}
