const { BrowserWindow } = require("electron"),
  { is, Mono, error } = require("./tools");

module.exports = class DevTool {

  //#region Private Params
  #self
  //#endregion
  /**
   * @param {Electron.BrowserWindowConstructorOptions} config 
   */
  constructor(config) {
    if (Mono.force(this)) throw error.mono
    this.#self = new BrowserWindow(is.obj(config) ? config : {})
  }
  kill() { this.#self.destroy(); this.#self = null }
  get self() { return this.#self }
}