const fs = require('fs');
const path = require('path');

const walkSync = (dir, filelist = []) => {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const dirFile = path.join(dir, file);
    const dirent = fs.statSync(dirFile);
    if (dirent.isDirectory()) {
      //console.log('directory', path.join(dir, file));
      //important
      var odir = {
        file: dirFile,
        files: []
      }
      odir.files = walkSync(dirFile, dir.files);
      filelist.push(odir);
    } else {
      filelist.push({
        file: dirFile
      });
    }
  }
  return filelist;
};
// either one. 
var walkSync2 = function(dir, filelist) {
var path = path || require('path');
var fs = fs || require('fs'),
    files = fs.readdirSync(dir);
filelist = filelist || [];
files.forEach(function(file) {
    if (fs.statSync(path.join(dir, file)).isDirectory()) {
        filelist = walkSync2(path.join(dir, file), filelist);
    }
    else {
        filelist.push(path.join(dir, file));
    }
});
return filelist;
};

const test_dir = 'E:/from4chan/4chan';
document.write(walkSync2(test_dir).join('<br/>'));
