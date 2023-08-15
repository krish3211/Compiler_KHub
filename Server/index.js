const connectToMongo = require('./Db')
const express = require("express")
require('dotenv').config()

connectToMongo();
const app = express()
const port = process.env.SERVER_PORT || 5000// server port number

app.use(express.json())

app.use('/api/auth', require('./routes/auth'));

app.listen(port ,() => {
    console.log(`Example app listening on port http://localhost:${port}`)
  })