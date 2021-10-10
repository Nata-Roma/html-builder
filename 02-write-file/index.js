const path = require('path');
const readline = require('readline');
const fs = require('fs');

const filePath = path.join(__dirname, 'text.txt');

const rl = readline.createInterface({
  input: process.stdin,
});

console.log('Welcome!\n Enter your text to be written to file "text.txt".\n For exit type "exit" or press "Ctrl + c"');

rl.on('line', input => {
  if (input === 'exit') {
    console.log('Bye-bye!');
    rl.close();
  } else {
    const data = input + '\n';
    fs.appendFile(filePath, data, err => {
      if (err) throw err;
    });
    rl.clearLine();
  }
})