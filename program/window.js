const fs = require('fs');
const path = require('path');

const test_multiple = 'E:/from4chan/4chan/wg/'
const test3 = 'E:/from4chan/4chan/';
const test_one = test_multiple + '7029580/';
const test4 = 'F:/Downloads';
files_test = () => {
  var dom = document.getElementById('div_files');
  dom.innerHTML += `<h4>${test_one}</h4>
    <ul id='ul_files'></ul>`;
  var ul = document.getElementById('ul_files');
  fs.readdirSync(test_one).forEach((file) => {
    ul.innerHTML += `<div class='thumbnail'>
    <img class='' src='${path.join(test_one, file)}'/>
    </div>` ;
  })
};
folders_test = (dir, filelist = []) => {
  var files = fs.readdirSync(dir);
  for(var file of files){
    var dir_file = path.join(dir, file);
    var dirent = fs.statSync(dir_file);
    if(dirent.isDirectory()){
      //console.log(dir_file);
      var dir_cont = {file: dir_file, files: []};
      dir_cont.files = folders_test(dir_file, dir.files);
      filelist.push(dir_cont);
    }else{
      //filelist.push({file: dir_file});
    }
  }
  return filelist;
};
draw_tree = (list, len = 0) => {
  var pre = '└📁';
  var len = len;
  var dom = document.getElementById('div_files');
  //console.log(list);
  //dom.innerHTML += len + '<br/>';
  for(var el of list){
    //dom.innerHTML += `${pre} ${el.file}<br/>`;
    var folder = el.file.split('\\');
    var len_diff = folder.length - len;
    var pre2 = get_pre(len_diff) + pre;
    var folder2 = folder[folder.length-1];
    dom.innerHTML += `${pre2} ${folder2}<br/>`;
    //dom.innerHTML += `${folder.length}<br/>`;
    for(var file of el.files){
      //dom.innerHTML += `${pre} ${file.file}<br/>`;
      var folder = file.file.split('\\');
      var len_diff = folder.length - len;
      var pre2 = get_pre(len_diff) + pre;
      var folder2 = folder[folder.length-1];
      dom.innerHTML += `${pre2} ${folder2}<br/>`;
      //dom.innerHTML += `${folder.length}<br/>`;
      if(file.files.length > 0){
        draw_tree(file.files, len);
      }else{
      }
    }
  }
};
get_pre = (len_diff) => {
  var add = '';
  if(len_diff > 0){
    for(x=0;x<len_diff;x++){
      add += '-';
    }
  }
  return add;
}

//files_test();
//folders_test(test3);
var list = folders_test(test3);
var len = list[0].file.split('\\').length;
//var len = 0;
draw_tree(list, len);
