const { app, BrowserWindow } = require("electron"),
  { is, each, Mono, error } = require("./tools"),
  url = require("url");

module.exports = class Main {

  //#region Private Params
  #self
  #usedApps = []
  //#endregion

  /**
   * @param {Electron.BrowserWindowConstructorOptions} config 
   */
  constructor(config) {
    if (Mono.force(this)) throw error.mono
    this.#self = new BrowserWindow(is.obj(config) ? config : {})
    this.on("closed", () => {
      each(this.#usedApps, x => x.kill())
      this.#self = null; app.quit()
    })
  }

  //#region Getters
  get self() { return this.#self }
  //#endregion

  //#region Private Methods
  #bounds(box) {
    if (is.empty(box.self)) return
    let z = this.#self.getBounds();
    box.self.setPosition(z.x + z.width, z.y)
  }
  //#endregion

  //#region Methods
  use(box, type = "DevTool") {
    let x = this.#self
    switch (type) {
      case "DevTool":
        x.webContents.setDevToolsWebContents(box.self.webContents)
        x.webContents.openDevTools({ mode: 'detach' })
        x.webContents.once('did-finish-load', () => this.#bounds(box))
        box.self.on('closed', () => box.kill())
        this.on("move", () => this.#bounds(box))
        break
    }
    this.#usedApps.push(box)
    return this
  }
  view(html) {
    this.#self.loadURL(url.format({
      pathname: is.str(html) ? html : HTML,
      protocol: 'file',
      slashes: true
    }))
    return this
  }
  on(event, func) {
    if (is.str(event) && is.func(func)) this.#self.on(event, func)
    return this
  }
  setIcon(url) { this.#self.setIcon(is.str(url) ? url : {}); return this }
  setTitle(title) {
    this.#self.setTitle(is.str(title) ? title : "X Titan")
    return this
  }
  //#endregion
}