const func_win = require('./window');
const fs = require('fs');

const test = 'E:/from4chan/4chan/';
const test2 = 'E:/from4chan/4chan/wg';

var content = fs.readFileSync('./program/test.json', 'utf8');
var add_cont2 = {'some path': 'some tags'};

var data = JSON.parse(content);
var add_data = JSON.stringify(add_cont2);
//fs.writeFileSync('./program/test.json', add_data);
//data.push(...add_data);
//fs.writeFileSync('./program/test.json', JSON.stringify(data, null, 2));
var dict = {};
dict['path'] = 'tags';
dict['other path'] = 'tags2';
dict['E:/from4chan/4chan/testimg.jpg'] = 'some tags';
console.log(JSON.stringify(dict, null, 2));
dict['path'] = 'tags1';
console.log(dict);

console.log(Object.keys(dict));
console.log(Object.values(dict));
console.log(Object.entries(dict));
