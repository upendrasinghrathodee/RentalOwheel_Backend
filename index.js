const express=require('express')
PORT=8989
const BasicRouter=require('./router/BasicRouter')
const AuthRouter=require('./router/AuthRouter')
const fileupload=require('express-fileupload')
const cors=require('cors')
const path = require('path')
const server=express()
server.use(express.static(path.join(__dirname,"upload")))
// server.use(fileupload())
server.use(cors())
server.use(express.urlencoded({extended:false,limit:'50mb'}))
server.use(express.json())
server.use('/rental',BasicRouter)
server.use('/auth',AuthRouter)
server.use((req,res)=>{
      res.json("Wrong Url................")
})
server.listen(PORT,()=>{
    console.log("server is running .....");
})
