//#region Types
/** @typedef {number} n */
/**
 * @typedef {"string" | "number" | "bigint" | "boolean" |
 * "symbol" | "undefined" | "object" | "function"} allTypes
 */
/** @typedef {(value, index: n) => (void | boolean)} iterator */
/** @typedef {(value, name: string) => (void | boolean)} iteratorOBJ */
//#endregion

//#region Check type
let is = Object.freeze({
  /**
   * @param {*} value 
   * @param {allTypes} type
   */
  type: (x, y) => typeof x === y,
  func: x => is.type(x, "function"),
  num: x => is.type(x, "number"),
  str: x => is.type(x, "string"),
  obj: x => is.type(x, "object"),
  empty: x => (x === null || x === undefined),
  array: x => Array.isArray(x),
  notClass: x => (x === globalThis || is.empty(x))
})
//#endregion

//#region Each
/**
 * @param {*[]} arr
 * @param {iterator} fn
 */
let each = (arr, fn) => {
  for (let i = 0; i < arr.length; i++)
    if (fn(arr[i], i) === true) return
}
/**
 * @param {{ }} obj
 * @param {iteratorOBJ} fn
 */
each.obj = (obj, fn) => {
  for (let k in obj)
    if (Object.hasOwnProperty.call(obj, k))
      if (fn(obj[k], k) === true) return
}
//#endregion

//#region Object Singleton
/** @type {string[]} */
let _listMono = ["Mono"]
/**
 * Сhecks whether this item is in the list and returns the result.
 * After checking, it is added to the list.
 * 
 * If the item is in the list returns "false". So it's okay.
 * 
 * Else "True". This means that the item is present in the list.
 * @class
 */
function Mono() {
  if (!is.notClass(this))
    throw new Error("This element is a class. Call 'new'")
  return Mono.force(new.target.name)
}
Mono.has = self => _listMono.includes(self);
/**
 * Сhecks whether this item is in the list and returns the result.
 * After checking, it is added to the list.
 * 
 * If the item is in the list returns "false". So it's okay.
 * 
 * Else "True". This means that the item is present in the list.
 * @param {string} self <-- new.target.name
 */
Mono.force = self => {
  let has = Mono.has(self)
  if (!has) _listMono.push(self)
  return has
}
//#endregion

//#region Error kit
let error = Object.freeze({
  mono: new Error("The Mono objects must be in a single instance")
})
//#endregion

//#region Export
module.exports = {
  is,
  each,
  Mono,
  error
}
//#endregion