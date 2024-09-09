const jwt=require('jsonwebtoken')
const security="oadhjkalknWOQ79QWHDLKAHDOIQ9874qdLKADKLJASDAJd"
const expire='10m'
function generateToken(userid,role){
     const token=jwt.sign({userid,role},security,{expiresIn:expire})
     return token
}

function verifyToken(token,callback){
     jwt.verify(token,security,(err,data)=>{
        if(err){
            callback(err,null)
        }
        else{
            callback(null,data)
        }
     })
}


module.exports={generateToken,verifyToken}