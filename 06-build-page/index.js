const path = require('path');
const fs = require('fs');
const fsPromises = require('fs/promises');

const cssDir = path.join(__dirname, 'styles');
const distDir = path.join(__dirname, 'project-dist');
const componentDir = path.join(__dirname, 'components');
const assetDir = path.join(__dirname, 'assets');

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
  let fileRes = await fsPromises.readFile(path.join(__dirname, 'template.html'), 'utf-8');
  const files = await fsPromises.readdir(componentDir, { withFileTypes: true });
  // console.log(files);
  files.forEach(async (file) => {
    if (path.extname(file.name) === '.html') {
      const component = await fsPromises.readFile(path.join(componentDir, file.name), 'utf-8');
      const index = file.name.lastIndexOf('.');
      const replaceable = `{{${file.name.slice(0, index)}}}`;
      fileRes = fileRes.replace(replaceable, component);
      await fsPromises.writeFile(path.join(distDir, 'index.html'), fileRes);
    }
  })
}

const copyAssetsDir = async (distDir, assetDir) => {
  const files = await fsPromises.readdir(assetDir, { withFileTypes: true });

  files.forEach(async (file) => {
    if (file.isDirectory()) {
      const newDir = path.join(assetDir, file.name);
      createDir(path.join(distDir, file.name))
        .then(() => {
          copyAssetsDir(path.join(distDir, file.name), newDir);
        })
        .catch(() => {
          copyAssetsDir(path.join(distDir, file.name), newDir);
        });
    } else {
      try {
        await fsPromises.copyFile(path.join(assetDir, file.name), path.join(distDir, file.name));
      } catch (error) {
      }
    }
  })

}

const createAssetsDir = async (distDir, assetDir) => {
  await fsPromises.mkdir(path.join(distDir, 'assets')).then(async () => {
    await copyAssetsDir(path.join(distDir, 'assets'), assetDir);
  }).catch(async () => {
    await copyAssetsDir(path.join(distDir, 'assets'), assetDir);
  })
}

const createDir = async (distDir, cssDir, componentDir, assetDir) => {
  await fsPromises.mkdir(distDir).then(async () => {
    await createCssBundle(distDir, cssDir);
    await createAssetsDir(distDir, assetDir);
    await createHtmlFile(distDir, componentDir);
  }).catch(async () => {
    await createCssBundle(distDir, cssDir);
    await createAssetsDir(distDir, assetDir);
    await createHtmlFile(distDir, componentDir);
  })
}

createDir(distDir, cssDir, componentDir, assetDir)