const express = require('express');
const router = express.Router();
const {createUser,
        getUser,
        getUserByUsername,
        getAllRoutinesByUser
    } = require("../db")
const jwt = require('jsonwebtoken')
const {requireUser} = require('./utils')
const { JWT_SECRET } = process.env
const bcrypt = require('bcrypt');


// POST /api/users/login
router.post("/login",async (req,res,next) => {
  const {username,password} = req.body
  
  if (!username || !password){
    res.send({name:"MissingCredentialsError",
    message:"PLease enter both username and password to login."})

    next();
  }

  try {
    const user = await getUserByUsername(username);

    const isValid = bcrypt.compare(password,user.password)

    const token = jwt.sign({id:user.id,username},JWT_SECRET)
    
    if (user && isValid) {
        res.send({message: "you're logged in!", user:{id:user.id,username} , token})
    } else {
        next({
            name: 'IncorrectCredentialError',
            message: 'Username or password is incorrect'
        });
    }
    return user
} catch (error) {
    next(error);
}
})



// POST /api/users/register
router.post('/register',async (req,res,next) => {
    const {username,password} = req.body

    const _user = await getUserByUsername(username)
    try{
        if (_user){
            res.send({error:"DuplicateUsers",
                      name:"DUplicateUser",
                      message:`User ${username} is already taken.`})
        }
        if (password.length < 8){
            res.send({error:"PasswordTooShort",
            name:"PasswordTooShort",
            message:"Password Too Short!"})
        }else {
            const user = await createUser({username,password})

            const token = jwt.sign({
                id: user.id,
                username
             },JWT_SECRET)
    
            res.send({
                message: 'Thank you for signing up!',
                token, user
            });
        }

        
    }catch({name,message}){
    next({name,message})
    }
})



// GET /api/users/me
router.get("/me",requireUser, async (req,res,next) => {
        try {
            res.send(req.user) 
          
        } catch (error) {    
            next(error);
        }

})

 // error: "NotUserError",
// message: "You must be logged in to perform this action",
// name: "NotUser"}


// GET /api/users/:username/routines
router.get("/:username/routines",requireUser, async (req,res,next) => {
    const {username}= req.params;

    const allRoutines = await getAllRoutinesByUser({username})
    console.log(allRoutines,"this is all routines by user")
    try {
    const routines = allRoutines.filter(routine => {if (routine.isPublic) {
        return true 
    } if (req.user && routine.user.id == req.user.id) {
        return true
    } 
    return false 
});
     
res.send(routines)
        
    } catch (error) {
        next();
    }
});

module.exports = router;
