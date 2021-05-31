const {
  Engine,
  Scene,
  Sprite2D,
  v2,
  Vector2,
  Loop
} = require('nonametitan_game'),
  { tools, DOM } = require('nonametitan_toolkit');

const { is, each } = tools,
  { search } = DOM

const CONFIG = {
  MapColor: "#4caf50",
  headColor: "#3f51b5",
  tileColor: "#2196f3",
  appleColor: "#f44336"
}


class Snake extends Engine {
  constructor() {
    super()
    this.move = {
      KeyA: false,
      KeyS: false,
      KeyW: false,
      KeyD: false
    }

    this.isMovemedKeys = x => x == "KeyA" || x == "KeyS" || x == "KeyD" || x == "KeyW";
  }
}
class SnakeScene extends Scene {
  constructor(move = { KeyA: false, KeyS: false, KeyW: false, KeyD: false }) {
    super({ canvas: search.id("screen") })
    this.mapSize = v2(32, 32)
    this.boxSize = v2(16, 16)
    this.ended = false

    this.move = move
    this.forceMove = "d"

    this.hero = new SnakeSprite(
      v2(~~this.mapSize.x / 2,
        ~~this.mapSize.y / 2))

    this.apple = v2()
    this.randomApple()

    this.canvas.width = this.mapSize.x * this.boxSize.x;
    this.canvas.height = this.mapSize.y * this.boxSize.y;
  }
  randomApple() {
    this.apple.x = Math.floor(Math.random() * this.mapSize.x)
    this.apple.y = Math.floor(Math.random() * this.mapSize.y)
  }
  Move() {
    this.hero.clear()
    let x = this.forceMove
    if (this.move.KeyW && this.forceMove !== "s") x = "w"
    if (this.move.KeyA && this.forceMove !== "d") x = "a"
    if (this.move.KeyS && this.forceMove !== "w") x = "s"
    if (this.move.KeyD && this.forceMove !== "a") x = "d"
    switch (this.forceMove = x) {
      case "w":
        this.hero.setMoveY(-1)
        break
      case "a":
        this.hero.setMoveX(-1)
        break
      case "s":
        this.hero.setMoveY(1)
        break
      case "d":
        this.hero.setMoveX(1)
        break
    }
  }
  tick() {
    let c = this.ctx, hero = this.hero, b = this.boxSize

    // Draw Map
    c.fillStyle = CONFIG.MapColor
    c.fillRect(0, 0, this.canvas.width, this.canvas.height)

    // Update Hero
    hero.tick(c, b)
    hero.updateX()
    hero.updateY()

    // Collision Map
    if (this.heroOutMap()) this.gameover()

    // Eat Apple
    if (this.collision()) { hero.eatApple(); this.randomApple() }

    // Draw Hero Head
    c.fillStyle = hero.colorHead
    c.fillRect(b.x * hero.getX, b.y * hero.getY, b.x, b.y)
    // Draw Hero Tiles
    c.fillStyle = hero.colorTile
    each(hero.tile, t => {
      c.fillRect(b.x * t.x, b.y * t.y, b.x, b.y)
      if (this.collision(t)) this.gameover() // Collision Tile
    })

    // Draw Apple
    c.fillStyle = CONFIG.appleColor
    c.fillRect(this.apple.x * b.x, this.apple.y * b.y, b.x, b.y)
  }
  heroOutMap() {
    let x = this.hero.getPos, y = this.mapSize;
    return !(x.x < y.x && x.x > -1 && x.y < y.y && x.y > -1)
  }
  collision(target) {
    let x = this.hero.getPos, y = target ? target : this.apple;
    return x.x == y.x && x.y == y.y
  }
  gameover() {
    alert("score: " + (this.hero.tile.length - 1))
    this.ended = true
  }
}

class SnakeSprite extends Sprite2D {
  /** @param {Vector2} pos */
  constructor(pos) {
    super()
    this.tile = []
    this.colorHead = CONFIG.headColor
    this.colorTile = CONFIG.tileColor
    this.setPos(pos.x, pos.y)
    this.last = v2(pos.x, pos.y)
  }
  /**
   * @param {CanvasRenderingContext2D} ctx
   * @param {Vector2} box
   */
  tick() {
    this.last = this.tile.shift()
    this.tile.push(this.getPos)
  }
  eatApple() { this.tile.unshift(this.last) }
}

const snakeGame = new Snake()
var snakeScene

function update(scene) {
  snakeGame.LoadScene(snakeScene = scene)
  snakeScene.Move()
  window.onkeydown = e => {
    if (snakeGame.isMovemedKeys(e.code)) snakeGame.move[e.code] = true
    snakeScene.Move()
  }
  window.onkeyup = e => {
    if (snakeGame.isMovemedKeys(e.code)) snakeGame.move[e.code] = false
  }
}

update(new SnakeScene(snakeGame.move))

const loop = setInterval(() => {
  snakeGame.tick()
  if (snakeScene.ended) update(new SnakeScene(snakeGame.move))
}, 150)
// const loop = new Loop(, { start: true })