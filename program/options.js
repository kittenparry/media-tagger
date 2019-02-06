const fs = require('fs');
const path = require('path');

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
  form.innerHTML += temp;
  form.innerHTML += `<hr/><div id='div_opts_btns' class='flex-row'>
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
opts_gen = (e) => {
  e.preventDefault();
  console.log(e);
};
options_save = (e) => {
  opts_gen(e);
};
options_discard = (e) => {
  opts_gen(e);
};
options_reset = (e) => {
  opts_gen(e);
};

set_everything = () => {
  render_options();
  set_button_listeners();
};

set_everything();
