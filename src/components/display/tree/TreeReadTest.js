//src:
//https://codeburst.io/practical-recursion-implementing-a-file-tree-view-in-react-electron-af62e7b46d26

import * as fs from 'fs';

const generateFileTreeObject = directoryString => {  
  return fs.readdirSync(directoryString)
    .then(arrayOfFileNameStrings => {
      const fileDataPromises = arrayOfFileNameStrings.map(fileNameString => {
        const fullPath = `${directoryString}/${fileNameString}`;
        return fs.statAsync(fullPath)
          .then(fileData => {
            const file = {};
            file.filePath = fullPath;
            file.isFileBoolean = fileData.isFile();
            /*Here is where we'll do our recursive call*/
            if (!file.isFileBoolean) {
              return generateFileTreeObject(file.filePath)
                .then(fileNamesSubArray => {
                  file.files = fileNamesSubArray;
                })
                .catch(console.error);
            }
            /*End recursive condition*/
            return file;
          });
      });
      return Promise.all(fileDataPromises);
    });
};
export default generateFileTreeObject;
