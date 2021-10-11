const path = require('path');
const fs = require('fs');
const fsPromises = require('fs/promises');

const cssDir = path.join(__dirname, 'styles');
const distDir = path.join(__dirname, 'project-dist');
const componentDir = path.join(__dirname, 'components');

const createCssBundle = async (distDir, cssDir) => {
  const files = await fsPromises.readdir(cssDir, { withFileTypes: true });
  files.forEach(async (file) => {
    if (path.extname(file.name) === '.css') {
      const fileRes = await fsPromises.readFile(path.join(cssDir, file.name), 'utf-8');
      await fsPromises.appendFile(path.join(distDir, 'style.css'), fileRes)
    }
  })
}

const createHtmlFile = async (distDir, componentDir) => {
  const fileRes = await fsPromises.readFile(path.join(__dirname, 'template.html'), 'utf-8');
  const files = await fsPromises.readdir(componentDir, { withFileTypes: true });
  files.forEach(async (file) => {
    if (path.extname(file.name) === '.html') {
      const component = await fsPromises.readFile(path.join(componentDir, file.name), 'utf-8');
      const index = file.name.lastIndexOf('.');
      fileRes.replace(`{{${file.name.slice(0, index)}}}`, component)
      await fsPromises.writeFile(path.join(distDir, 'index.html'), fileRes);
    }
  })
  // console.log(fileRes);
}

const createDir = async (distDir, cssDir, componentDir) => {
  // const dirPath = path.join(__dirname, 'project-dist');
  await fsPromises.mkdir(distDir).then(async () => {
    await createCssBundle(distDir, cssDir);
    await createHtmlFile(distDir, componentDir);
    console.log('CREATE');
  }).catch(async () => {
    await createCssBundle(distDir, cssDir);
    await createHtmlFile(distDir, componentDir);
    console.log('EXISTS');
  })
}

createDir(distDir, cssDir, componentDir)