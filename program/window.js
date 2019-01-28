const fs = require('fs');
const path = require('path');
const tags = require('./tags');

display_errors = false;
read_data = {};
//draw files in accordance to the mouse click on tree
draw_files = (dir) => {
  var dom = document.getElementById('div_files');
  dom.innerHTML = `<h4>${dir}</h4>
    <div id='div_sel_btns'>
      <button id='sel_all_btn'>Select All</button>
      <button id='desel_all_btn'>Deselect All</button>
      <label id='err_label'>Load errors?</label> <input id='err_check' type='checkbox'/>
    </div>
    <div>
      <form id='form_files'></form>
    </div>`;
  var div = document.getElementById('form_files');
  div.addEventListener('click', (e) => {
    if(e.target.tagName === 'IMG'){
      image_check(e.target);
    }
  });
  document.getElementById('div_sel_btns').addEventListener('click', (e) => {
    if(e.target.tagName === 'BUTTON'){
      var con;
      if(e.target.id == 'sel_all_btn'){
        con = true;
      }else if(e.target.id == 'desel_all_btn'){
        con = false;
      }
      select_all(con);
    }else if(e.target.id === 'err_check' || e.target.id == 'err_label'){
      display_errors = !display_errors;
      draw_files(dir);
    }
  });
  document.getElementById('err_check').checked = display_errors;
  fs.readdirSync(dir).forEach((file) => {
    var dir_file = path.join(dir, file);
    var dirent = fs.statSync(dir_file);
    //check if the src is a directory (more like if it isn't)
    if(!dirent.isDirectory()){
      div.innerHTML += `<div class='thumbnail'>
        <input class='inv' type='checkbox'/>
        <img src='${path.join(dir, file)}'
        onerror='image_load_err(this);'/>
        </div>` ;
    }
  });
  div.innerHTML += `<div id='div_sub_btns'>
      <input type='text'/>
      <button type='submit'>Add</button>
      <button type='submit'>Remove</button>
    </div>`;
};
//display an error message or don't display the div at all
//on image load error
image_load_err = (img) => {
  var div = img.parentNode;
  if(display_errors){
    img.classList.add('inv');
    div.classList.add('overflow-x');
    div.innerHTML = `Error loading the media.<br/>
    <span class='err_src'>${img.src}</span><br/>`;
  }else{
    div.classList.add('inv');
  }
};
//check the checkbox that exists in the same div as the image
image_check = (e) => {
  var checkbox = e.parentElement.firstElementChild;
  checkbox.checked = !checkbox.checked;
  var div = e.parentNode;
  if(checkbox.checked){
    div.classList.add('selected');
  }else{
    div.classList.remove('selected');
  }
};
//check all the checkboxes
select_all = (con) => {
  var els = document.getElementById('form_files').childNodes;
  els.forEach((el) =>{
    if(el.firstElementChild.type == 'checkbox'){
      var checkbox = el.firstElementChild;
      checkbox.checked = con;
      if(checkbox.checked){
        el.classList.add('selected');
      }else{
        el.classList.remove('selected');
      }
    }
  });
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
  var dom = document.getElementById('div_tree_tree');
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
};
//returns the tree element of a folder
get_tree_el = (pre, folder, path) => {
  var el = `<div title='${path}' class='tree_el'>${pre} ${folder}</div>`;
  return el;
};
/*
 * pre: file display name prefix
 * len_diff: difference in length to the first path
 *  to determine the number of &nbsp; prints in the get_pre()
 * add: file prefix with additional spaces depending on the len_diff
 * folder: folder name split from the path (last element of split_path)
 */
//returns file prefix and folder name from file path and first path length
get_values = (file, len) => {
  var pre = '└📁';
  var split_path = file.split('\\');
  var len_diff = split_path.length - len;
  var add = get_pre(len_diff) + pre;
  var folder = split_path[split_path.length - 1];
  return [add, folder, file];
};
//adds a new div inside the container to hold the tree
//binds a click event that then draws the files on files container
add_div_tree = () => {
  document.getElementById('div_tree').innerHTML += `<div id='div_tree_tree'></div>`;
  document.getElementById('div_tree_tree').addEventListener('click', (e) => {
    draw_files(e.target.title);
  });
};
//TODO: add sorting methods to the tags
draw_tags = () => {
  var div = document.getElementById('div_tags');
  div.innerHTML += `<form id='form_tags'>
  <button type='submit'>Filter</button>
  <div id='div_tags_tags'></div>
  </form>`;
  var dom = document.getElementById('div_tags_tags');
  dom.addEventListener('click', (e) => {
    //event
    //similar checkbox selection to the images
  });
  var tags_dict = count_tags();
  for(var el of Object.entries(tags_dict)){
    dom.innerHTML += get_tags_el(...el);
  }
}
get_tags_el = (tag, val) => {
  var el = `<div title='${tag}' class='tags_el'>
    <input class='inv' type='checkbox'/>
    ${tag} <span class='tag_bg'>${val}</span>
    </div>`;
  return el;
}
count_tags = () => {
  var all_tags = Object.values(read_data).join(' ').split(' ');
  var results = {};
  all_tags.forEach((x) => {results[x] = (results[x] || 0) + 1;});
  return results;
}
//gets folder list, gets first path length, draws the file tree
print_tree = (path) => {
  read_data = tags.read_db();
  add_div_tree();
  var list = get_folders(path);
  var len = list[0].file.split('\\').length;
  draw_tree(list, len);
  draw_tags();
};

module.exports = {
  print_tree: print_tree,
};
