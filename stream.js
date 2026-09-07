const fs = require ('fs');

const readStream = fs.createReadStream('./lorem.txt' , 'utf8')
const writeStream = fs.createWriteStream('./new-lorem.txt')

readStream.on('data' , (c) => writeStream.write(c))
readStream.pipe(writeStream)