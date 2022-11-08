const client = require('./client');

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
    throw error;
  }
}

async function getAllRoutines() {
}

async function getAllRoutinesByUser({username}) {
}

async function getPublicRoutinesByUser({username}) {
}

async function getAllPublicRoutines() {
}

async function getPublicRoutinesByActivity({id}) {
}

async function createRoutine({creatorId, isPublic, name, goal}) {
  try {
    const {rows: [routine]} = await client.query(`
    INSERT INTO routines("creatorId", "isPublic", name, goal)
    VALUES ($1, $2, $3, $4)
    ON CONFLICT (name) DO NOTHING
    RETURNING *;
    `, [creatorId, isPublic, name, goal]);
    console.log(routine, "new routine")
    return routine;
  } catch (error) {
    console.error("Error creating routine")
    throw error
  }
}

async function updateRoutine({id, ...fields}) {
}

async function destroyRoutine(id) {
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