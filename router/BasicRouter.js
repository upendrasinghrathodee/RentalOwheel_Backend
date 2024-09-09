const router=require('express').Router()
const jwt=require('jsonwebtoken')
const fs=require('fs')
const {User,ServiceProvider,sequelize,VehicleMaster,Vehicles}=require('../models')
const ApiResponse=require('./ApiResponse')
const {generateToken}=require('../config/JWTconfig')

router.post('/login',async (req,res)=>{
     const {email,password}=req.body
     const data=await User.findOne({where:{email,password}})
     if(data==null)
        res.json(new ApiResponse(false,"email or password is incorrect",))
    else{
        const role=data.role
        const name=data.name
        const token=generateToken(data.id,data.role)
        res.json(new ApiResponse(true,"token is generated",[token,role,name]))
    }

})


//customer registraion
// name,phone,email,password
router.post('/cust/register',async (req,res)=>{
    const data=req.body
    const user={...data,role:"customer",status:true}

    try{
        const dat=await User.create(user)
         res.json(new ApiResponse(true,"Registration is succesful, Please Login...",dat))
    }catch(err){
        console.log("Error occured",err);
        res.json(new ApiResponse(false,"Registraion Failed..."))
    }
})

//service provider registration
//name,phone,email,password,companny_name,address,contact,reg_number,contact_person
router.post('/sp/register',async (req,res)=>{
     //const t= await sequelize.transaction()
    const {name,email,phone,password,company_name,address,contact,reg_number,contact_person}=req.body
    const user={name,email,phone,password,role:"Service_Provider",status:true}
    
    // try{
    //     const user_dat=await User.create(user,{transaction:t})
    //     const sp={company_name,address,contact,reg_number,contact_person,user:user_dat.id}
    //     const sp_dat=await ServiceProvider.create(sp,{transaction:t})
    //     res.json(new ApiResponse(true,"Service Provider Registered",[user_dat,sp_dat]))
    //     await t.commit()
    // }
    // catch(err){
    //     await t.rollback()
    //    console.log(err);
    //    res.json(new ApiResponse(false,"unable to Register the Service Provider"))
    // }
  try{
    const result=await sequelize.transaction(async t=>{
        const usef=await User.create(user,{transaction:t})
        const sp={company_name,address,contact,reg_number,contact_person,user:usef.id}
        const ap=  await ServiceProvider.create(sp,{transaction:t})

        return [ap,usef]

    })
       res.json(new ApiResponse(true,"Registration is Succesful,Please Login...",result))
}
    catch(err){
        console.log(err);
        res.json(new ApiResponse(false,"Unable to Register in Service Prvider",err))
    }
})
//vehicle list
router.get('/list_vehicle',async (req,res)=>{
    let data=await Vehicles.findAll({
       include:['user','veh_master']
    })
    data=JSON.parse(JSON.stringify(data))
    data=data.map(obj=>{
        
        return {...obj,images:fs.readdirSync(`upload/vehicle/${obj.images}`).map(ob=>`http://localhost:8989/vehicle/${obj.images}/${ob}`)}
    }
)
console.log(data);

    res.json(new ApiResponse(true,"data",data))
})

//vehicle master list
router.get('/list_vm',async (req,res)=>{
   const data=await VehicleMaster.findAll();
   res.json(new ApiResponse(true,'vm list ',data));
})

router.post('/admin_save',async (req,res)=>{
       const bd=req.body
       const ans=await User.create({...bd,role:"admin",status:true})
       res.json(new ApiResponse(true,"admin added",ans))
})
module.exports=router