const fs = require('fs');
const fsPromises = fs.promises;
const path = require('path');

const dirPath = path.join(__dirname, 'files');
const copyPath = dirPath + '-copy';

const getFiles = async (currentPath, newPath) => {
  const files = await fsPromises.readdir(currentPath, { withFileTypes: true });
  files.forEach(async (file) => {
    if (file.isDirectory()) {
      const newDir = path.join(newPath, file.name);
      createDir(newDir)
        .then(() => {
          getFiles(path.join(currentPath, file.name), newDir);
          // console.log('\nmkDir CREATE');
        })
        .catch(() => {
          getFiles(path.join(currentPath, file.name), newDir);
          // console.log('\nmkDir FAIL');
        });
    } else {
      try {
        await fsPromises.copyFile(path.join(currentPath, file.name), path.join(newPath, file.name));
      } catch (error) {
      }
    }
  })
}

async function createDir(copyPath) {
  return await fsPromises.mkdir(copyPath);
}

createDir(copyPath).then(() => getFiles(dirPath, copyPath)).catch(() => getFiles(dirPath, copyPath));
