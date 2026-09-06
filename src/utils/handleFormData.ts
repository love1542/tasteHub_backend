import multer from 'multer';
import AppError from './errorHandling.js';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, file.fieldname + '-' + uniqueSuffix + '.' + file.originalname.split('.').pop());
    },
})

const upload = multer({
    storage: storage,
    limits:{
        fileSize: 1024 * 1024 * 5, 
    },

    fileFilter(req, file, cb) {
        const allowedTypes = ['image/jpeg', 'image/png'];
         console.log("FILE:", file);
  console.log("MIMETYPE:", file.mimetype);

        if (!allowedTypes.includes(file.mimetype)) {
            return cb(new AppError('Only .jpeg and .png files are allowed!', 400));
        }
        cb(null, true);
    },
});
    

export default upload;