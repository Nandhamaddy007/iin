var express = require('express');
const multer=require('multer')
const fs=require('fs')
var path = require('path');
const {sendMails}  = require('./messaging/sendMailer');
const { addUser } = require('./database/addUser');
var router = express.Router();

/* GET home page. */
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
      cb(null, 'uploads/');
  },

  // By default, multer removes file extensions so let's add them back
  filename: function(req, file, cb) {
   
      cb(null, file.originalname);
  }
});
const convertToObject=(data)=>{
    
let temp=data.replaceAll('\"',"").split(';')
// console.log(temp,"temp")
let column=temp[0].split(',');
// console.log(column,"columns")
let newObj=[]
for(let i=1;i<temp.length-1;i++){
  let cells=temp[i].replaceAll('\r\n','').split(",")
  // console.log(cells,"cells")
  let obj={}
for(let j=0;j<column.length;j++){
obj[column[j]]=cells[j]
}

newObj.push(obj)
}
console.log(newObj)
return newObj
}
router.post('/saveUser', function(req, res, next) {
  let upload = multer({ storage: storage }).single('userDetails');
 
  upload(req, res, function(err) {
    console.log(req.file)
   if (err) {
        return res.send(err);
    }else{
      fs.readFile("./"+req.file.destination+req.file.originalname,'utf8',(err,data)=>{
        console.log(data.toString())
         let details=convertToObject(data)
        addUser(data)
        //  sendMails(details)

      })
      console.log("./"+req.file.destination+req.file.originalname)
    }
res.send(req.file) 
}); 
});



module.exports = router;
