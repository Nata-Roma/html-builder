const path = require('path');
const fs = require('fs/promises');
const { stat } = require('fs');

const dirPath = path.join(__dirname, 'secret-folder/');

const getFiles = async (currentPath) => {
  const files = await fs.readdir(currentPath, { withFileTypes: true });
  files.forEach((file) => {
    if (file.isDirectory()) {
      return getFiles(path.join(currentPath, file.name, '/'))
    }
    stat(path.join(currentPath, file.name), (err, stats) => {
      console.log('\nFile name: ', file.name.slice(0, file.name.lastIndexOf('.')));
      console.log('File extension: ', path.extname(file.name).slice(1));
      console.log('File weight: ', stats.size + 'b');
    })
  })
}

getFiles(dirPath)