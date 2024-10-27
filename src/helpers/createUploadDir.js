import fs from 'fs';

export const ensureUploadDirExists = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, {recursive: true});
  }
};
