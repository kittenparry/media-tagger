const fs = require('fs');
const path = require('path');

const test_multiple = 'E:/from4chan/4chan/wg/'
const test_one = test_multiple + '7029580/';
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

files_test();
