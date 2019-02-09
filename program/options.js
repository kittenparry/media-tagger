const fs = require('fs');
const path = require('path');

const options_folder = path.join(__dirname, 'options');
const options_file = path.join(__dirname, 'options/settings.json');

// defaults here
// TODO: make a separate list to grab these from for here and render
const def_settings = {
  'display_errors': false,
  'display_tags': false,
  'deselect_after_tagging': false,
};
//generate on, off radio buttons
gen_yn_radios = (label, name) => {
  return `<tr>
  <td><label>${label}</label></td>
  <td><input type='radio' name='${name}' value='on'/> on 
  <input type='radio' name='${name}' value='off'/> off</td></tr>`;
};
//render options page
render_options = () => {
  var form = document.getElementById('form_options');
  var str_yn = {
    'Display errors': 'display_errors',
    'Display tags under images': 'display_tags',
    'Deselect after tagging': 'deselect_after_tagging',
  }
  str_yn_label = Object.keys(str_yn);
  str_yn_name = Object.values(str_yn);
  var temp = '<table>';
  for(x=0;x<str_yn_label.length;x++){
    temp += gen_yn_radios(str_yn_label[x], str_yn_name[x]);
  }
  temp += '</table>';
  form.innerHTML = temp;
  form.innerHTML += `<hr/><span id='message'></span>
    <div id='div_opts_btns' class='flex-row'>
    <button id='btn_sav_opts'>Save</button> 
    <button id='btn_dis_opts'>Discard</button> 
    <button id='btn_res_opts'>Reset</button></div>`;
};
//button event listeners
set_button_listeners = () => {
  document.getElementById('btn_sav_opts').addEventListener('click', options_save);
  document.getElementById('btn_dis_opts').addEventListener('click', options_discard);
  document.getElementById('btn_res_opts').addEventListener('click', options_reset);
};
get_settings = () => {
  var option_keys = Object.keys(def_settings);
  var temp_options = {};
  var form = document.getElementById('form_options');
  for(var el of form){
    if(el.type == 'radio'){
      for(opt of option_keys){
        if(el.name == opt){
          if(el.checked){
            if(el.value == 'on'){
              temp_options[el.name] = true;
            }else{
              temp_options[el.name] = false;
            }
          }
        }
      }
    }
  }
  return temp_options;
};
get_checks = (settings) => {
  var keys = Object.keys(settings);
  var vals = Object.values(settings);
  var form = document.getElementById('form_options');
  for(var el of form){
    if(el.type == 'radio'){
      for(opt of keys){
        if(el.name == opt){
          if(settings[opt]){
            if(el.value == 'on'){
              el.checked = true;
            }
          }else{
            if(el.value == 'off'){
              el.checked = true;
            }
          }
        }
      }
    }
  }
};
options_save = (e) => {
  e.preventDefault();
  var settings = get_settings();
  save_settings(settings);
};
options_discard = (e) => {
  e.preventDefault();
  location.reload();
};
options_reset = (e) => {
  e.preventDefault();
  save_settings(def_settings);
  location.reload();
};
read_settings = () => {
  if(fs.existsSync(options_file)){
    return JSON.parse(fs.readFileSync(options_file, 'utf8'));
  }else{
    if(!fs.existsSync(options_folder)){
      fs.mkdirSync(options_folder);
    }
    fs.writeFileSync(options_file, JSON.stringify(def_settings, null, 2));
    return read_settings();
  }
};
save_settings = (info) => {
  var msg = document.getElementById('message');
  try{
    fs.writeFileSync(options_file, JSON.stringify(info, null, 2));
    msg.innerHTML = 'Settings saved.';
  }catch(e){
    msg.innerHTML = 'An error occurred.';
  }
};

set_everything = () => {
  var read_data = read_settings();
  render_options();
  get_checks(read_data);
  set_button_listeners();
};

set_everything();
