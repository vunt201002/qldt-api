import path from 'path';
import {uploadDir} from '../config/multer.config.js';

export function getFileUlr(filename) {
  return path.join(uploadDir, filename);
}
