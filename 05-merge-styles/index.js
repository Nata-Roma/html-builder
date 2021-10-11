const path = require('path');
const fs = require('fs');
const fsPromises = require('fs/promises');

const fileDir = path.join(__dirname, 'styles');

const readFileData = async (fileDir) => {
  const files = await fsPromises.readdir(fileDir, { withFileTypes: true });

  files.forEach(async (file) => {
    if (file == undefined) return;
    if (file.isDirectory()) {
      return readFileData(path.join(fileDir, file.name))
    } else {
      if (path.extname(file.name) === '.css') {
        const fileRes = await fsPromises.readFile(path.join(fileDir, file.name), 'utf-8');
        await fsPromises.appendFile(path.join(__dirname, 'project-dist', 'bundle.css'), fileRes)
      }
    }
  })
}

const createDir = async (fileDir) => {
  const dirPath = path.join(__dirname, 'project-dist');
  await fs.promises.mkdir(dirPath).then(async () => {
    readFileData(fileDir);
  }).catch(async () => {
    const files = await fsPromises.readdir(path.join(__dirname, 'project-dist'), { withFileTypes: true });
    const fileFound = files.find((file) => file.name === 'bundle.css');
    if (fileFound) {
      fsPromises.rm(path.join(__dirname, 'project-dist', fileFound.name))
        .then(async () => {
          await readFileData(fileDir);
        })
    } else {
      await readFileData(fileDir);
    };
  })
}

createDir(fileDir)