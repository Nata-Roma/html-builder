const fs = require('fs');
const path = require('path');
const { stdout, stdin } = require('process');

const filePath = path.join(__dirname, 'text.txt');

console.log('file path', filePath);

fs.readFile(filePath, (err, file) => {
  if (err) {
    console.error(err);
  } else {
    console.log('\nFile content via console.log and toString() method');
    console.log(file.toString());

    console.log('\nFile content via stdout');
    stdout.write(file)
  }
});

fs.readFile(filePath, 'utf8', (err, file) => {
  if (err) {
    console.error(err);
  } else {
    console.log('\nFile content via console.log and utf8');
    console.log(file);
  }
});

const stream = fs.createReadStream(filePath, 'utf8');
stream.on('data', file => {
  console.log('\nFile content via create Stream and utf8');
  console.log(file)
});
stream.on('error', error => console.log(`Error: ${error}`));
