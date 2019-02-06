const electron = require('electron');
const url = require('url');
const path = require('path');

const {app, BrowserWindow, Menu} = electron;

let main_window;
let options_window;

//app ready
app.on('ready', () => {
  //create window
  main_window = new BrowserWindow({
    width: 1280,
    height: 1024,
  });
  //load html into the window
  //file://dirname/main_window.html
  main_window.loadURL(url.format({
    pathname: path.join(__dirname, 'program/window.html'),
    protocol: 'file',
    slashes: true,
  }));
  //quit on main window close
  main_window.on('closed', () => {
    app.quit();
    main_window = null;
  });
  //build menu from template
  const main_menu = Menu.buildFromTemplate(main_menu_template);
  //insert menu
  Menu.setApplicationMenu(main_menu);
  //start with dev tools opened
  // main_window.webContents.openDevTools();
});
//open options window function
const open_options = () => {
  options_window = new BrowserWindow({
    width: 400,
    height: 300,
  });
  options_window.loadURL(url.format({
    pathname: path.join(__dirname, 'program/options.html'),
    protocol: 'file',
    slashes: true,
  }));
  options_window.on('close', () => {
    options_window = null;
  });
};
//menu template
const main_menu_template = [
  {
    label: 'File',
    submenu: [
      {
        label: 'Options',
        accelerator: process.platform == 'darwin' ? 'Command+P' : 'Ctrl+P',
        click(){
          open_options();
        }
      },
      {
        label: 'Close',
        accelerator: process.platform == 'darwin' ? 'Command+Q' : 'Ctrl+Q',
        click(){
          app.quit();
        }
      }
    ]
  }
];
//if mac, add empty object to menu
if(process.platform == 'darwin'){
  main_menu_template.unshift({});
}
//dev tools when not in production
if(process.env.NODE_ENV !== 'production'){
  main_menu_template.push({
    label: 'Dev Tools',
    submenu: [
      {
        label: 'Toggle',
        accelerator: process.platform == 'darwin' ? 'Command+I' : 'Ctrl+I',
        click(item, focusedWindow){
          focusedWindow.toggleDevTools();
        }
      },
      {
        role: 'reload'
      }
    ]
  });
}
