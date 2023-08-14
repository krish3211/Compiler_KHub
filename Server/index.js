const express = require("express")
const connectToMongo = require('./Db')
require('dotenv').config()

connectToMongo();
const app = express();
const port = process.env.SERVER_PORT;

app.get('/',(req,res)=>{
    res.send("hello")
})


app.listen(port ,() => {
    console.log(`Example app listening on port https://localhost:${port}`)
  })