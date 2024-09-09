const router = require("express").Router();
const path = require("path");
const fs=require('fs')
const Apiresponse = require("./ApiResponse");
const multer=require('multer')
const { v4: uuidv4 } = require("uuid");
const {Vehicles, VehicleMaster, User,sequelize,ServiceProvider } = require("../models");
const vehicles = require("../models/vehicles");
const { where } = require("sequelize");

router.use((req, res, next) => {
  if (req.userInfo.role === "admin") {
    next();
  } else {
    res.json(new Apiresponse(true, "Uauthorized Access!!"));
  }
});


//multer  setup


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, `upload/vm`)
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix+path.extname(file.originalname))
  }
})

const upload = multer({ storage })

//model,type,image,capacity_seats,capacity_tons
router.post("/save_vm", upload.single('image'),async (req, res) => {
  const bd = req.body;
  const imgPath = "upload/vm/" + req.file.filename
  console.log(imgPath);
  const obj = {
    ...bd,
    image: "http://localhost:8989/" + imgPath.replace("upload/", ""),
  };
  const data = await VehicleMaster.create(obj);
  res.json(new Apiresponse(true, `Model is added Succesful`, data));
});


router.get("/cust/list", async (req, res) => {
  const data = await User.findAll({
    attributes: { exclude: ["user", "createdAt", "updatedAt"] },
  });
  res.json(new Apiresponse(true, "found", data));
});

//delete vm
router.delete("/delete_vm/:id",async (req,res)=>{
    const id=req.params.id
    const vm=await VehicleMaster.findOne({where:{id}}) 
    if(vm){
         const dat=await VehicleMaster.destroy({where:{id}})
         res.json(new Apiresponse(true,"Model Deleted Successful....",dat))
      }else{
      res.json(new Apiresponse(false,"No Record Found to delete"))
    }
})


//delete user 
router.delete("/cust/delete/:id", async (req, res) => {
  const id = req.params.id;
  console.log(id);
  const dat = await User.findOne({ where: { id }, include: ["sp","vehicles"] });
  console.log(dat.vehicles);
  dat.vehicles.forEach(element => {
     console.log(element.id);
  });
  console.log(dat);
  if (dat != null) {
    if (dat.sp==null) {
       if(dat.role=="admin")
       {
         res.json(new Apiresponse(false,"Cannot Delete Admin"))
       }
       else{
      try {
        const data = await User.destroy({ where: { id } });
        res.json(new Apiresponse(true, "user Deleted", data));
      } catch (err) {
        console.log(err);
        res.json(new Apiresponse(false, "Got an Error", err));
      }
   }
    }
    else{
      try{
         const result = await sequelize.transaction(async t=>{ 
           const ssd=await Vehicles.destroy({where:{provider:id}},{transaction:t})
           const spd=await ServiceProvider.destroy({where:{id:dat.sp.id}},{transaction:t})
            const userd=await User.destroy({where:{id}},{transaction:t})
           return [ssd,spd,userd]
      })
         res.json(new Apiresponse(true,"User is Deleted Successful",result))

      }catch(err){
           res.json(new Apiresponse(false,"Unable to Delete the User",err))
      }
    }
  }
  else{
      res.json(new Apiresponse(false,"User is not Found"))
  }
});


// update user
router.put("/cust/update/:id",upload.single('image'),async (req,res)=>{
    const id=req.params.id
    let obj={...req.body}
    let old_img=undefined
     if(req.file){
             const imgPath = "upload/vm/" + req.file.filename
             obj={...obj,image: "http://localhost:8989/" + imgPath.replace("upload/", "")}
           const vm=await VehicleMaster.findOne({where:{id}})
            old_img=vm.image.replace("http://localhost:8989/vm/","upload/vm/")
            console.log(old_img);
            
     }
     try{
          console.log(obj);
          
          const data=await VehicleMaster.update(obj,{where:{id}})
          const dat=await VehicleMaster.findOne({where:{id}})
           
          res.json(new Apiresponse(true,"Vehicle Master is Updated Successful",dat))
          if(data&&old_img!=undefined){
            fs.unlink(old_img, (err => {
              if (err) console.log(err);
              else {
              console.log("\n Deleted File "+old_img.replace('upload/vm/',""));
                    
              }
            }));
          }
     }catch(err){
      console.log(err);
      
     }
})

module.exports = router;
