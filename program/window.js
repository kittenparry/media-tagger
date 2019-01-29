const fs = require('fs');
const path = require('path');
const tags = require('./tags');

display_errors = false;
read_data = {};
//draw files in accordance to the mouse click on tree
draw_files = (dir, tags = false, selected = []) => {
  var dom = document.getElementById('div_files');
  dom.innerHTML = `<h4 id='title_files'>${dir}</h4>
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
  if(tags){
    document.getElementById('title_files').innerHTML = selected.join(' ');
    for(var tag of dir){
      div.innerHTML += get_img_el(tag);
    }
  }else{
    fs.readdirSync(dir).forEach((file) => {
      var dir_file = path.join(dir, file);
      var dirent = fs.statSync(dir_file);
      //check if the src is a directory (more like if it isn't)
      if(!dirent.isDirectory()){
        div.innerHTML += get_img_el(path.join(dir, file));
      }
    });
  }
  div.innerHTML += `<div id='div_sub_btns'>
      <input id='input_tags' type='text'/>
      <button id='tags_add_btn'>Add</button>
      <button id='tags_rem_btn'>Remove</button>
    </div>`;
  document.getElementById('input_tags').addEventListener('keyup', (e) => {
    e.preventDefault();
    if(e.key === "Enter"){
      update_tags(e);
    }
  });
  document.getElementById('tags_add_btn').addEventListener('click', update_tags);
  document.getElementById('tags_rem_btn').addEventListener('click', remove_tags);
};
get_img_el = (src) => {
  var el = `<div class='thumbnail'>
    <input class='inv' type='checkbox'/>
    <img src='${src}'
    onerror='image_load_err(this);'/>
  </div>`;
  return el;
};
//display an error message or don't display the div at all
//on image load error
image_load_err = (img) => {
  var div = img.parentNode;
  if(display_errors){
    var src = img.src;
    //img.classList.add('inv');
    //instead remove it to prevent source grabbing from tag updates when select_all is used
    img.remove();
    div.classList.add('overflow-x');
    div.innerHTML = `Error loading the media.<br/>
    <span class='err_src'>${src}</span><br/>`;
  }else{
    div.classList.add('inv');
    img.remove();
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
  div.innerHTML = `<form id='form_tags'>
  <button type='submit'>Filter</button>
  <div id='div_tags_tags'></div>
  </form>`;
  var dom = document.getElementById('div_tags_tags');
  document.getElementById('form_tags').addEventListener('submit', filter_tags);
  dom.addEventListener('click', (e) => {
    select_tag(e.target);
  });
  var tags_dict = count_tags();
  for(var el of Object.entries(tags_dict)){
    dom.innerHTML += get_tags_el(...el);
  }
};
filter_tags = (e) => {
  e.preventDefault();
  var selected = get_checked_tag();
  var read_vals = Object.values(read_data);
  var read_keys = Object.keys(read_data);
  var will_print = [];
  for(var x=0;x<read_vals.length;x++){
    var split_read = read_vals[x].split(' ');
    for(var tag of selected){
      if(split_read.includes(tag)){
        will_print.push(read_keys[x]);
      }
    }
  }
  will_print = remove_duplicates(will_print);
  draw_files(will_print, true, selected);
};
get_tags_el = (tag, val) => {
  var el = `<div title='${tag}' class='tags_el'>
    <input class='inv' type='checkbox' value='${tag}'/>
    ${tag} <span class='tag_bg'>${val}</span>
    </div>`;
  return el;
};
count_tags = () => {
  var all_tags = Object.values(read_data).join(' ').split(' ').sort();
  var results = {};
  all_tags.forEach((x) => {results[x] = (results[x] || 0) + 1;});
  return results;
};
select_tag = (e) => {
  //catch SPAN
  var checkbox;
  var div;
  if(e.tagName === 'SPAN'){
    checkbox = e.parentElement.firstElementChild;
    div = e.parentElement;
  }else{
    checkbox = e.firstElementChild;
    div = e;
  }
  checkbox.checked = !checkbox.checked;
  if(checkbox.checked){
    div.classList.add('selected');
  }else{
    div.classList.remove('selected');
  }
};
get_checked_tag = () => {
  var form = document.getElementById('form_tags');
  var changes = [];
  for(var el of form){
    if(el.type == 'checkbox'){
      if(el.checked){
        changes.push(el.value);
      }
    }
  }
  return changes;
};
get_checked = () => {
  var form = document.getElementById('form_files');
  var changes = [];
  for(var el of form){
    if(el.type == 'checkbox'){
      if(el.checked){
        try{
          //should probably move up the try-catch to also get checkbox
          var img = el.parentElement.children[1];
          if(img.tagName = 'IMG'){
            changes.push(img.src);
          }
        }catch(e){}
      }
    }
  }
  return changes;
};
get_input = () => {
  var input = document.getElementById('input_tags');
  //remove additional whitespace (eg. "  hi    simon   " => "hi simon")
  var tags = input.value.replace(/\s+/g, " ").trim();
  input.value = "";
  input.focus();
  return tags;
}
remove_tags = (e) => {
  e.preventDefault();
  var del_tags = get_input();
  var changes = get_checked();
  for(var ch of changes){
    try{
      var ex_tags = read_data[ch].split(' ');
      var up_split = del_tags.split(' ');
      for(var up of up_split){
        if(ex_tags.includes(up)){
          ex_tags = ex_tags.filter((e) => {return e !== up});
        }
      }
      read_data[ch] = ex_tags.sort().join(' ');
    }catch(e){}
  }
  tags.save_db(read_data);
  draw_tags();
};
update_tags = (e) => {
  e.preventDefault();
  var tags = get_input();
  var changes = get_checked();
  var updates = {};
  for(var x=0;x<changes.length;x++){
    updates[changes[x]] = tags;
  }
  check_tag_updates(updates, tags);
};
check_tag_updates = (updates, new_tags) => {
  var ex_path = Object.keys(read_data);
  var updated = Object.entries(updates);
  var temp_changes = [];
  var temp_new = [];
  //check if the path exists in the db
  for(var up of updated){
    if(ex_path.includes(up[0])){
      temp_changes.push(up[0]);
    }else{
      temp_new.push(up[0]);
    }
  }
  for(var ch of temp_changes){
    var ex_split = read_data[ch].split(' ');
    var up_split = new_tags.split(' ');
    var combined = ex_split.concat(up_split).sort();
    var results = remove_duplicates(combined).join(' ');
    read_data[ch] = results;
  }
  for(var ne of temp_new){
    read_data[ne] = new_tags;
  }
  tags.save_db(read_data);
  draw_tags();
};
remove_duplicates = (arr) => {
  output = [];
  temp = {};
  for(var x=0;x<arr.length;x++){
    temp[arr[x]] = 0;
  }
  for(var i in temp){
    output.push(i);
  }
  return output;
};
search_tags = (e) => {
  e.preventDefault();
  //TODO: basically the same function as filter_tags
  var input = document.getElementById('input_search');
  var selected = input.value.replace(/\s+/g, " ").trim().split(' ');
  input.value = "";
  input.focus();
  var read_vals = Object.values(read_data);
  var read_keys = Object.keys(read_data);
  var will_print = [];
  for(var x=0;x<read_vals.length;x++){
    var split_read = read_vals[x].split(' ');
    for(var tag of selected){
      if(split_read.includes(tag)){
        will_print.push(read_keys[x]);
      }
    }
  }
  will_print = remove_duplicates(will_print);
  draw_files(will_print, true, selected);
};
draw_search = () => {
  var div = document.getElementById('div_search');
  div.innerHTML += `<form id='search_form'>
    <input id='input_search' type='text'/>
    <input type='submit' value='Search'/>`
  document.getElementById('search_form').addEventListener('submit', search_tags);
};
//gets folder list, gets first path length, draws the file tree
print_tree = (path) => {
  read_data = tags.read_db();
  add_div_tree();
  var list = get_folders(path);
  var len = list[0].file.split('\\').length;
  draw_tree(list, len);
  draw_tags();
  draw_search();
};

module.exports = {
  print_tree: print_tree,
};
