import multer from 'multer';
import path from 'path';
import {ensureUploadDirExists} from '../helpers/createUploadDir.js';

const uploadDir = path.join(__dirname, 'uploads/materials');
ensureUploadDirExists(uploadDir);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({storage});

export default upload;
