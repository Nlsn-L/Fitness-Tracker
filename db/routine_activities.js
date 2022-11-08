const client = require('./client')

async function getRoutineActivityById(id){
}

async function addActivityToRoutine({
  routineId,
  activityId,
  count,
  duration,
}) {
    try {
     const {rows: [routine_activity]} = client.query(`
     INSERT INTO routine (activityId, count, duration)
     FROM routine_activities
     WHERE id=$1
     RETURNING *;
     `, [routineId,activityId, count, duration]) 

      console.log(routine_activity, "this is routine from addthang")
     return routine_activity;
    } catch (error) {
      throw error;
    }
}

async function getRoutineActivitiesByRoutine({id}) {
}

async function updateRoutineActivity ({id, ...fields}) {
}

async function destroyRoutineActivity(id) {
}

async function canEditRoutineActivity(routineActivityId, userId) {
}

module.exports = {
  getRoutineActivityById,
  addActivityToRoutine,
  getRoutineActivitiesByRoutine,
  updateRoutineActivity,
  destroyRoutineActivity,
  canEditRoutineActivity,
};
