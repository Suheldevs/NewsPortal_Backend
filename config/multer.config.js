import multer from 'multer'
import fs from 'fs'
const uploadPath = './upload/articleImages/';
if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath);

const storage = multer.diskStorage({
    destination:(req, file, cb)=>{
        cb(null,uploadPath)
    },
    filename:(req,file,cb)=>{
        cb(null, modifyName(file) )
    }
})

export const upload = multer({storage})

export const modifyName = (file)=>{
  const file_name =   file.originalname.split('.')[0] + '-' + Date.now() + '.' + file.originalname.split('.')[1]
  return file_name ;
}