const connectToMongo = require('./Db')
const express = require("express")
require('dotenv').config()

connectToMongo();
const app = express()
const port = process.env.SERVER_PORT || 5000// server port number

app.use(express.json())

app.use('/api/auth', require('./routes/auth'));
app.use('/api/compiler',require('./routes/compiler'));
app.use('/api/CodingQuestion', require('./routes/PQustion'));

app.listen(port ,() => {
    console.log(`Example app listening on port http://localhost:${port}`)
  })