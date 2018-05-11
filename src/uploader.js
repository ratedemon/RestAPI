import multer from 'koa-multer'

let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'images/')
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now()+ '.jpg');
    }
});

export const upload = multer({
    storage: storage,
    limits:{
        fileSize:2*1024*1024
    },
    fileFilter: function (req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
            return cb(new Error('Only image files are allowed!'));
        }
        console.log(file);
        cb(null, true);
    }
});