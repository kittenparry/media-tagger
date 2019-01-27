const fs = require('fs');
const path = require('path');

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
//returns file tree dictionary and array of a path
get_folders = (dir, filelist = []) => {
  var everything = fs.readdirSync(dir);
  for(var file of everything){
    var dir_file = path.join(dir, file);
    var dirent = fs.statSync(dir_file);
    //check if a path is directory
    //if it is run the function again
    if(dirent.isDirectory()){
      var dir_cont = {file: dir_file, files: []};
      dir_cont.files = get_folders(dir_file, dir.files);
      filelist.push(dir_cont);
    }else{
      //filelist.push({file: dir_file});
      //add non-folders to the filelist
      //not needed for the project
    }
  }
  return filelist;
};
//len: length of the first path in the tree
draw_tree = (list, len = 0) => {
  var len = len;
  var dom = document.getElementById('div_tree');
  for(var el of list){
    dom.innerHTML += get_tree_el(...get_values(el.file, len));
    for(var file of el.files){
      dom.innerHTML += get_tree_el(...get_values(file.file, len));
      if(file.files.length > 0){
        draw_tree(file.files, len);
      }
    }
  }
};
//adds x number of spaces to the display prefix of a folder
get_pre = (len_diff) => {
  var add = '';
  if(len_diff > 0){
    for(x=0;x<len_diff;x++){
      add += '&nbsp;&nbsp;'; //maybe use one instead?
    }
  }
  return add;
}
//returns the tree element of a folder
get_tree_el = (pre, folder) => {
  var el = `<div class='tree_el'>${pre} ${folder}</div>`;
  return el;
}
//returns file prefix and folder name from file path and first path length
/*
 * pre: file display name prefix
 * len_diff: difference in length to the first path
 *  to determine the number of &nbsp; prints in the get_pre()
 * add: file prefix with additional spaces depending on the len_diff
 * folder: folder name split from the path (last element of split_path)
 */
get_values = (file, len) => {
  var pre = '└📁';
  var split_path = file.split('\\');
  var len_diff = split_path.length - len;
  var add = get_pre(len_diff) + pre;
  var folder = split_path[split_path.length - 1];
  return [add, folder];
};
//gets folder list, gets first path length, draws the file tree
print_tree = (path) => {
  var list = get_folders(path);
  var len = list[0].file.split('\\').length;
  draw_tree(list, len);
}

module.exports = {
  print_tree: print_tree,
}
