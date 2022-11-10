require("dotenv").config()
const express = require("express")
const app = express()
const cors = require("cors")
// Setup your Middleware and API Router here
app.use(cors())
const morgan = require("morgan");
app.use(morgan("dev"));

app.use(express.json());
const client = require('./db/client')
client.connect();

const apiRouter = require("./api")
app.use('/api',apiRouter)







module.exports = app;
