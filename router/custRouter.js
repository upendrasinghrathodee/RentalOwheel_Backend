const router=require('express').Router()
const {User}=require('../models')
const response=require('./ApiResponse')

router.use((req,res,next)=>{
     if(req.userInfo.role==="customer"){
        next()
     }
     else{
        res.json(new response(true,"Uauthorized Access!!"))
     }
  })

module.exports=router