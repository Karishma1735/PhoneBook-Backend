import multer from 'multer'


const imgStorage = multer.diskStorage({
     destination:'images',
      filename:(req,file,cb)=>{
        cb(null,file.fieldname+"_"+Date.now()+path.extname(file.originalname))
    }
})


 export const imgUpload = multer({
    storage:imgStorage,
    limits:{
        fileSize:1000000
    },
    fileFilter(req,file,cb){
        if (!file.originalname.match(/\.(png|jpeg)$/)){
              return cb(new Error('Please upload a Image'))
        }
        cb(undefined,true)
    }
})