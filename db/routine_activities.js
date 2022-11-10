const { attachActivitiesToRoutines } = require('./activities')
const client = require('./client')

async function getRoutineActivityById(id){

  try {
    const {rows: [routine_activity]} = await client.query(`
    SELECT *
    FROM routine_activities
    WHERE id = $1
    `,[id])

    return routine_activity
  } catch (error) {
    console.error("Error getting routine_activity by id!")
    throw error
  }

}

async function addActivityToRoutine({
  routineId,
  activityId,
  count,
  duration,
}) {
    try {
     const {rows: [routine_activity]} = await client.query(`
     INSERT INTO routine_activities ("routineId", "activityId", count, duration)
     VALUES ($1, $2, $3, $4)
     ON CONFLICT ("routineId", "activityId") DO NOTHING
     RETURNING *;
     `, [routineId, activityId, count, duration]) 

     
     return routine_activity;
    } catch (error) {
      console.error("Error adding activity to routine!")
      throw error;
    }
}

async function getRoutineActivitiesByRoutine({id}) {

  try {
    const {rows} = await client.query(`
    SELECT * 
    FROM routine_activities
    WHERE routine_activities."routineId" = $1     
    `,[id])

    return rows
  } catch (error) {
    console.error("Error getting routine activities by routine!")
    throw error;
  }



}

async function updateRoutineActivity ({id, ...fields}) {
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
    UPDATE routine_activities
    SET ${setString}   
    WHERE id=${id}
    RETURNING *;   
    `,Object.values(fields))
    return result
  }catch (error) {
    console.error("Error updating routine activity!")
    throw error;
}


}

async function destroyRoutineActivity(id) {
try {
  const {rows:[deletedRoutineActivity]} = await client.query(`
   DELETE FROM routine_activities
   WHERE routine_activities.id = $1
   RETURNING *;
   `,[id])

  console.log(deletedRoutineActivity)
  return deletedRoutineActivity
} catch (error) {
  console.error("Error destroying routine activity")
  throw error
}

}

async function canEditRoutineActivity(routineActivityId, userId) {

  try {
    const {rows} = await client.query(`

    
    `,[routineActivityId,userId])


  } catch (error) {
    console.error("Error in this function")
    throw error
  }


}

module.exports = {
  getRoutineActivityById,
  addActivityToRoutine,
  getRoutineActivitiesByRoutine,
  updateRoutineActivity,
  destroyRoutineActivity,
  canEditRoutineActivity,
};
