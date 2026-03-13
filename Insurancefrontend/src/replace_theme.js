const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? 
      walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

walkDir('.', function(filePath) {
  if (filePath.endsWith('.ts') || filePath.endsWith('.html') || filePath.endsWith('.css')) {
    let oldContent = fs.readFileSync(filePath, 'utf8');
    let newContent = oldContent
      .replace(/violet/g, 'blue')
      .replace(/fuchsia/g, 'yellow');
    if (oldContent !== newContent) {
      fs.writeFileSync(filePath, newContent, 'utf8');
      console.log('Updated: ' + filePath);
    }
  }
});
