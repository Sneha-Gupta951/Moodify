require("dotenv").config()

const app = require('./src/app')

const connectToDB = require('./src/consfig/database')
connectToDB()

app.listen(3000, ()=>{
  console.log("server is start")
})