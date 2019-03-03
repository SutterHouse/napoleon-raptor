var fs = require('fs');

module.exports.fossilize = (genePool, projectName) => {
  const folderPath = './archive/';
  const filePath = `./archive/${projectName}.json`;
  if (!fs.existsSync(folderPath)){
    fs.mkdirSync(folderPath);
  }
  genePoolString = JSON.stringify(genePool);
  fs.writeFileSync(filePath, genePoolString, { flag: 'w' });
}

module.exports.rehydrate = (projectName) => {
  const path = `./archive/${projectName}.json`;
  if (fs.existsSync(path)) {
    return JSON.parse(fs.readFileSync(path));
  }
}