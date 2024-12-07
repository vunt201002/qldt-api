import multer from 'multer';
import path from 'path';
import {fileURLToPath} from 'url';
import {dirname} from 'path';

import {ensureUploadDirExists} from '../helpers/createUploadDir.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const uploadDir = path.join(__dirname, '../uploads');
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
