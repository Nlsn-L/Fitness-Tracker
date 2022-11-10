const client = require('./client');
const {attachActivitiesToRoutines} = require('./activities')

async function getRoutineById(id){
  try{ 
    const {rows: [routine]} = await client.query(`
    SELECT *
    FROM routines
    WHERE id=$1;
    `, [id]);

    return routine;
  } catch (error) {
    console.error("Error getting routine")
    throw error;
  }
}

async function getRoutinesWithoutActivities(){
  try{ 
    const {rows} = await client.query(`
    SELECT *
    FROM routines;
    `);

    console.log(rows, "this is rows")
    return rows;
  } catch (error) {
    console.error("Error getting routines without activities!")
    throw error;
  }
}

async function getAllRoutines() {
  try{
    const {rows} = await client.query(`
    SELECT routines.*, users.username AS "creatorName"
    FROM routines
    JOIN users ON routines."creatorId" = users.id
    `)
    return attachActivitiesToRoutines(rows);
  } catch (error) {
    console.error("Error getting all routines!")
    throw error;
  }
}

async function getAllRoutinesByUser({username}) {
  try {
    
    const {rows} = await client.query(`
    SELECT routines.*, users.username AS "creatorName"
    FROM routines
    JOIN users ON routines."creatorId" = users.id
    WHERE username = $1;
    `,[username]);

    return attachActivitiesToRoutines(rows);
  } catch (error) {
    console.error("Error getting routines by username!")
    throw error;
  }
}

async function getPublicRoutinesByUser({username}) {
try {
  const {rows} = await client.query(`
    SELECT routines.*, users.username AS "creatorName"
    FROM routines
    JOIN users on routines."creatorId" = users.id
    WHERE username = $1 AND routines."isPublic" = true;
  `,[username])

  return attachActivitiesToRoutines(rows)
} catch (error) {
  console.error("Error getting public routines by user!")
  throw error
}

}

async function getAllPublicRoutines() {
  try {
    const {rows} = await client.query(`
    SELECT routines.*, users.username AS "creatorName"
    FROM routines
    JOIN users on routines."creatorId" = users.id
    WHERE routines."isPublic" = true    
    `)

    return attachActivitiesToRoutines(rows)
  } catch (error) {
    console.error("Error getting all public routines!")
  }
}

async function getPublicRoutinesByActivity(params) {

  const {id} = params
  try {
    const {rows} = await client.query(`
    SELECT routines.*, users.username AS "creatorName"
    FROM routines
    JOIN users ON routines."creatorId" = users.id
    JOIN routine_activities ON routine_activities."routineId" = routines.id
    WHERE routines."isPublic" = true AND routine_activities."activityId" = $1
    `, [id])
const routines = await attachActivitiesToRoutines(rows)
    return routines
  } catch (error) {
    console.error("Error getting public routines by activity!")
    throw error;
  }
}

async function createRoutine({creatorId, isPublic, name, goal}) {
  try {
    const {rows: [routine]} = await client.query(`
    INSERT INTO routines("creatorId", "isPublic", name, goal)
    VALUES ($1, $2, $3, $4)
    ON CONFLICT (name) DO NOTHING
    RETURNING *;
    `, [creatorId, isPublic, name, goal]);
   
    return routine;
  } catch (error) {
    console.error("Error creating routine")
    throw error
  }
}

async function updateRoutine({id, ...fields}) {
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
    UPDATE routines
    SET ${setString}   
    WHERE id=${id}
    RETURNING *;   
    `,Object.values(fields))
    return result
  }catch (error) {
    console.error("Error updating activity!")
    throw error;
}

}

async function destroyRoutine(id) {
  try{


    // eslint-disable-next-line no-unused-vars
    const {row} = await client.query(`
    DELETE FROM routine_activities
    WHERE routine_activities."routineId" = $1  
    `,[id])

    // eslint-disable-next-line no-unused-vars
    const {rows} = await client.query(`
    DELETE FROM routines
    WHERE routines.id = $1;
    `, [id])

  } catch (error){
    console.error("Error destroying routine!")
    throw error;
  }
}

module.exports = {
  getRoutineById,
  getRoutinesWithoutActivities,
  getAllRoutines,
  getAllPublicRoutines,
  getAllRoutinesByUser,
  getPublicRoutinesByUser,
  getPublicRoutinesByActivity,
  createRoutine,
  updateRoutine,
  destroyRoutine,
}