const electron = require('electron');
const url = require('url');
const path = require('path');
const is_dev = require('electron-is-dev');

const {app, BrowserWindow, Menu} = electron;

let main_window;

//app ready
app.on('ready', function(){
  //create window
  main_window = new BrowserWindow({
    width: 1280,
    height: 1024,
  });
  //load html into the window
  //file://dirname/main_window.html
  main_window.loadURL(
    is_dev ? 'http://localhost:3000' :
      url.format({
        pathname: path.join(__dirname, '../build/index.html'),
        protocol: 'file',
        slashes: true,
  }));
  //quit on main window close
  main_window.on('closed', function(){
    //process.exit();
    //TODO: doesn't kill the server on window shutdown.
    app.quit();
    main_window = null;
  });
  //build menu from template
  const main_menu = Menu.buildFromTemplate(main_menu_template);
  //insert menu
  Menu.setApplicationMenu(main_menu);
  //start with dev tools opened
  //main_window.webContents.openDevTools();
});
//menu template
const main_menu_template = [
  {
    label: 'File',
    submenu: [
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
