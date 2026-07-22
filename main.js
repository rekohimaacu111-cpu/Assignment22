console.log ("************ASSIGNMENT2************");
            
const path = require('path');
const fs = require('fs');
const EventEmitter = require('events');
//Q1
console.log({ File: __filename, Dir: __dirname });

//Q2

console.log(path.basename('/user/files/report.pdf'));
  
//Q3
console.log(path.format({ dir: '/folder', name: 'app', ext: '.js' }));

//Q4

console.log(path.extname('/docs/readme.md')); 

//Q5

const { name, ext } = path.parse('/home/app/main.js');
console.log({ Name: name, Ext: ext }); 

// Q6
console.log(path.isAbsolute('/home/user/file.txt')); 

//Q7

console.log(path.join('src', 'components', 'App.js')); 

//Q8
console.log(path.resolve('./index.js')); 

//Q9

console.log(path.join('/folder1', 'folder2/file.txt')); 

// Q10
fs.unlink('./test.txt', (err) => {
    if (err) return console.error(err.message);
    console.log('The file.txt is deleted.');
});

//Q11
try {
  fs.mkdirSync('./newFolder');
  console.log('Success');
} catch (err) { console.error(err.message); }

//Q12
const emitter = new EventEmitter();
emitter.on('start', () => console.log('Welcome event triggered!'));
emitter.emit('start');

//Q13
const emitter2 = new EventEmitter();
emitter2.on('login', (username) => console.log(`User logged in: ${username}`));
emitter2.emit('login', 'Ahmed');

//Q14

const content = fs.readFileSync('./notes.txt', 'utf8');
console.log(content);

//Q15
fs.writeFile('./async.txt', 'Async save', (err) => {
  if (err) return console.error(err.message);
  console.log('File saved successfully.');
});

//Q16
console.log(fs.existsSync('./notes.txt')); 

//Q17
const os = require('os');
console.log({ Platform: os.platform(), Arch: os.arch() });

//Q18
const stream = fs.createReadStream('./big.txt', { encoding: 'utf8' });
stream.on('data', (chunk) => console.log('Chunk:', chunk));
stream.on('end', () => console.log('Finished reading file.'));

//Q19
const readStream = fs.createReadStream('./source.txt');
const writeStream = fs.createWriteStream('./dest.txt');
readStream.pipe(writeStream);
writeStream.on('finish', () => console.log('File copied using streams'));

//Q20
const zlib = require('zlib');
const { pipeline } = require('stream');

pipeline(
  fs.createReadStream('./data.txt'),
  zlib.createGzip(),
  fs.createWriteStream('./data.txt.gz'),
  (err) => err ? console.error(err.message) : console.log('File compressed successfully.')
);
                     


