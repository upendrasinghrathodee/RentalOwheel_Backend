const router=require('express').Router()
const AdminRouter=require('./AdminRouter')
const spRouter=require('./spRouter')
const custRouter=require('./custRouter')
const response=require('./ApiResponse')
const {verifyToken}=require('../config/JWTconfig')
router.use((req,res,next)=>{
     const tokenheader=req.headers.authorization
    if(tokenheader==undefined){
          res.json(new response(false,"token is not found....."));
    }
    else{
    const stri=tokenheader.substring(tokenheader.indexOf(" ")+1)
    verifyToken(stri,(err,data)=>{
      if(err){
              console.log(err);
              res.json(new response(false,"Session is Expired"))
            }
            else{
               const userid=data.userid
               const role=data.role
               req.userInfo={userid,role}              
                next()
            }
    })
  
    //  jwt.verify(stri,security,(err,data)=>{
    //     if(err){
    //       console.log(err);
    //       res.json(new response(false,"token is Expired"))
    //     }
    //     else{
    //         next()
    //     }
    //  })
   
    }
})
    console.log("admin panel");
       router.use('/admin',AdminRouter)


  console.log("kdflkfs");
router.use('/sp',spRouter)
router.use('/cust',custRouter)
module.exports=router