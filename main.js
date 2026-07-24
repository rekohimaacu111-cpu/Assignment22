console.log("**ASSIGNMENT2**");

const path = require('path');
const fs = require('fs');
const EventEmitter = require('events');

// Q1
const printFileDetails = () => console.log({ File: __filename, Dir: __dirname });
printFileDetails();

// Q2
const extractFileName = (filePath) => console.log(path.basename(filePath));
extractFileName('/user/files/report.pdf');

// Q3
const constructPath = (pathObj) => console.log(path.format(pathObj));
constructPath({ dir: '/folder', name: 'app', ext: '.js' });

// Q4
const fetchExtension = (filePath) => console.log(path.extname(filePath));
fetchExtension('/docs/readme.md');

// Q5
const extractNameAndExt = (filePath) => {
  const { name: fileName, ext: fileExt } = path.parse(filePath);
  console.log({ Name: fileName, Ext: fileExt });
};
extractNameAndExt('/home/app/main.js');

// Q6
const verifyAbsolutePath = (targetPath) => console.log(path.isAbsolute(targetPath));
verifyAbsolutePath('/home/user/file.txt');

// Q7
const combineSegments = (...segments) => console.log(path.join(...segments));
combineSegments('src', 'components', 'App.js');

// Q8
const makeAbsolutePath = (relativePath) => console.log(path.resolve(relativePath));
makeAbsolutePath('./index.js');

// Q9
const mergeTwoPaths = (pathA, pathB) => console.log(path.join(pathA, pathB));
mergeTwoPaths('/folder1', 'folder2/file.txt');

// Q10
const removeFileAsync = (targetFile) => {
  fs.unlink(targetFile, (err) => {
    if (err) return console.error(err.message);
    console.log('The file.txt is deleted.');
  });
};
removeFileAsync('./test.txt');

// Q11
const makeDirectorySync = (dirName) => {
  try {
    fs.mkdirSync(dirName);
    console.log('Success');
  } catch (error) {
    console.error(error.message);
  }
};
makeDirectorySync('./newFolder');

// Q12
const customEmitter = new EventEmitter();
customEmitter.on('start', () => console.log('Welcome event triggered!'));
customEmitter.emit('start');

// Q13
const authEmitter = new EventEmitter();
authEmitter.on('login', (usr) => console.log(`User logged in: ${usr}`));
authEmitter.emit('login', 'Ahmed');

// Q14
const readFileSyncAndLog = (filePath) => {
  try {
    const fileData = fs.readFileSync(filePath, 'utf8');
    console.log(`the file content => "${fileData}"`);
  } catch (err) {
    console.error(err.message);
  }
};
readFileSyncAndLog('./notes.txt');

// Q15
const saveFileAsync = (dest, data) => {
  fs.writeFile(dest, data, (err) => {
    if (err) return console.error(err.message);
    console.log('File saved successfully.');
  });
};
saveFileAsync('./async.txt', 'Async save');

// Q16
const checkExistence = (itemPath) => console.log(fs.existsSync(itemPath));
checkExistence('./notes.txt');

// Q17
const getSystemSpecs = () => {
  const osModule = require('os');
  console.log({ Platform: osModule.platform(), Arch: osModule.arch() });
};
getSystemSpecs();

// Q18
const readInChunks = (file) => {
  const fileStream = fs.createReadStream(file, { encoding: 'utf8' });
  fileStream.on('data', (bufferChunk) => console.log('Chunk:', bufferChunk));
  fileStream.on('end', () => console.log('Finished reading file.'));
};
readInChunks('./big.txt');

// Q19
const duplicateFileUsingStreams = (source, target) => {
  const srcStream = fs.createReadStream(source);
  const destStream = fs.createWriteStream(target);
  srcStream.pipe(destStream);
  destStream.on('finish', () => console.log('File copied using streams'));
};
duplicateFileUsingStreams('./source.txt', './dest.txt');

// Q20
const compressFilePipeline = (inputFile, outputFile) => {
  const zlib = require('zlib');
  const { pipeline } = require('stream');
  pipeline(
    fs.createReadStream(inputFile),
    zlib.createGzip(),
    fs.createWriteStream(outputFile),
    (err) => (err ? console.error(err.message) : console.log('File compressed successfully.'))
  );
};
compressFilePipeline('./data.txt', './data.txt.gz');