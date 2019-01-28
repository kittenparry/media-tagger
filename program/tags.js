const path = require('path');
const fs = require('fs');

//maybe have a constants file for this
const db_folder = path.join(__dirname, 'db');
const db_path = path.join(__dirname, 'db/tags.json');
read_db = () => {
  if(fs.existsSync(db_path)){
    //TODO: try catch
    return JSON.parse(fs.readFileSync(db_path, 'utf8'));
  }else{
    if(!fs.existsSync(db_folder)){
      fs.mkdirSync(db_folder);
    }
    fs.writeFileSync(db_path, '{}');
    return '{}'; //maybe put this into a variable?
    //or rerun the function?
  }
};
//req db, array of key and values? maybe [][]?
//Object.keys/values/entries()
update_db = (db, updates) => {
  for(var el of Object.entries(updates)){
    db[el[0]] = el[1];
  }
  save_db(db);
};
save_db = (db) => {
  //TODO: add try catch
  fs.writeFileSync(db_path, JSON.stringify(db));
  //JSON.stringify(db, null, 2) for readability
};

module.exports = {
  db_path: db_path,
  read_db: read_db,
  update_db: update_db,
};
