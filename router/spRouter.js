const router=require('express').Router();
const response = require('./ApiResponse');
const {User,ServiceProvider,Vehicles}=require('../models');
const multer=require('multer')
const {v4:uuidv4}=require("uuid")
const fs=require('fs');
const path = require('path');
const { where } = require('sequelize');
let filePath=undefined
router.use((req,res,next)=>{
   if(req.userInfo.role==="Service_Provider"){ 
      if(req.url==="/save_vehicle"){
          filePath=uuidv4()
         fs.mkdir(`upload/vehicle/${filePath}`,(err)=>{
            if(err){
                console.log("Caught an Error in Creating directory for vehicle"+err);   
            }
            else{
               console.log("directory is created!!");   
            }
         })
          next()
      }
      else{
         next()
      }
   }
   else{
      res.json(new response(true,"Uauthorized Access!!"))
   }
})
 router.get('/list',async (req,res)=>{
    const data=await ServiceProvider.findAll({
          include:['service_Provider_Details'],
         attributes:{ exclude:['user','createdAt','updatedAt']}
    })
    res.json(new response(true,"Service Provider list",data))
 })

//specific sp vehicle list
 router.get('/vehicle/list',async (req,res)=>{
      const id=req.userInfo.userid
      try{
         let dat=await Vehicles.findAll({where:{provider:id},
            include:['user','veh_master']
         })
         res.json(new response(true,"Service Provider list",dat))
      }catch(err){
         console.log(err);
         
      }

 })


 const storage = multer.diskStorage({
   destination: function (req, file, cb) {
     cb(null, `upload/vehicle/${filePath}`)
   },
   filename: function (req, file, cb) {
     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
     cb(null, file.fieldname + '-' + uniqueSuffix+path.extname(file.originalname))
   }
 })
 
 const upload = multer({ storage })

 //reg_number ,ispuc,isinsurance,fuel_type,price_km,price_days,ac_charges,status,provider,master
 router.post('/save_vehicle',upload.array('cars',6),async (req,res)=>{
     const bd=req.body
     console.log(bd);
      
     const obj={...bd,status:true,provider:req.userInfo.userid,images:filePath} 
     try{
     const data=await Vehicles.create(obj)
     res.json(new response(true,"Vehicle Added",data))
     }
     catch(err){
      console.log(err);
      
        res.json(new response(false,"vehicles got error"))
     }
     
 })
 

  //delete vehicle 
  router.delete('/delete/:id',async (req,res)=>{
     const id=req.params.id
     const dat=await Vehicles.findOne({where:{id}})
     if(dat){
       const data=await Vehicles.destroy({where:{id}})
       res.json(new response(true,"vehicle Removed",data))
     }else{
      res.json(new response(false,"vehicle Not Found"))
     }
  })
module.exports=router