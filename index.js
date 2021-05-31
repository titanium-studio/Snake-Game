const { app,BrowserWindow } = require("electron"),
  path = require('path'),
  Main = require('./src/code/main'),
  DevTool = require('./src/code/devtool');

//#region #### Config
/** Config for a Main Window */
const HTML = path.join(__dirname, "src/game/index.html")
const TITLE = "MAXIMUM"
const ICON = path.join(__dirname, "src/img/png/hero2.png")
/**
 * @type {Electron.BrowserWindowConstructorOptions}
 */
const CONFIG = {
  width: 512,
  height: 512 + 28,
  icon: ICON,
  frame: false,
  resizable: false,
  // transparent: true,
  webPreferences: {
    nodeIntegration: true,
    contextIsolation: false,
    enableRemoteModule: true
  }
}
//#endregion

app.on('ready', () => {
  const main = new Main(CONFIG)
  // const devtool = new DevTool()
  main
    .setIcon(ICON)
    .setTitle(TITLE)
    // .use(devtool)
    .view(HTML)
})
app.on('window-all-closed', () => app.quit())