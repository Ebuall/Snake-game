import * as React from "react"

import { List } from "immutable"
import { Dir, point } from "../model"
import * as Result from "../Result"
import { randomInt } from "../random"

import { Field } from "./Field"
import { Snake } from "./Snake"
import { Info } from "./Info"
import { Pix } from "./Pix"

const GameState = {
  Init: 0,
  Plaing: 1,
  Over: 2,
}

export const ctx = {
  border: 10,
  height: 15,
  width: 20,
  scale: 20,
  timer: 200,
}

function makeRandomPoint() {
  const x = randomInt(0, ctx.width)
  const y = randomInt(0, ctx.height)
  return point(x, y)
}

function hitTheTail(dot, tail) {
  return tail.find(p => p.equals(dot))
}

function hitTheWall({ x, y }) {
  return x < 0 || y < 0 || x >= ctx.width || y >= ctx.height
}

function generateFood(snake) {
  let food
  do {
    food = makeRandomPoint()
  } while (hitTheTail(food, snake))
  return food
}

function getInitialState() {
  const x = ctx.width / 2
  const pieces = List.of(
    point(x, 2),
    point(x, 1),
    point(x, 0),
  )
  return {
    dir: Dir.Up,
    nextDir: Dir.Up,
    pieces,
    gameState: GameState.Init,
    food: generateFood(pieces),
  }
}

export class Game extends React.Component {
  constructor(props) {
    super(props)
    this.state = getInitialState()
    this.gameLoop = undefined
    this.handleKeys = this.handleKeys.bind(this)
    this.tick = this.tick.bind(this)
  }

  start() {
    this.stop()
    this.setState(getInitialState)
    this.gameLoop = setInterval(this.tick, ctx.timer)
  }

  stop() {
    clearInterval(this.gameLoop)
  }

  moveSnake(dir, pieces, food) {
    const newHead = pieces.first().move(dir)
    let eatenFood = false
    let newTail = pieces
    if (newHead.equals(food)) {
      eatenFood = true
    } else {
      newTail = pieces.butLast()
    }
    if (
      hitTheWall(newHead) ||
      hitTheTail(newHead, newTail)
    ) {
      return Result.err("Game Over")
    } else {
      return Result.ok({
        eatenFood,
        pieces: newTail.unshift(newHead),
      })
    }
  }

  tick() {
    this.setState(state => {
      const dir = state.nextDir
      return this.moveSnake(dir, state.pieces, state.food)
        .map(({ pieces, eatenFood }) => {
          let food = state.food
          if (eatenFood) {
            food = generateFood(pieces)
          }
          return { dir, pieces, food }
        })
        .onErr(e => console.log(e))
        .getOrElse(() => {
          this.stop()
          return { gameState: GameState.Over }
        })
    })
  }

  handleKeys(ev) {
    let nextDir
    switch (ev.key) {
      case "ArrowUp":
        nextDir = Dir.Up; break
      case "ArrowRight":
        nextDir = Dir.Right; break
      case "ArrowDown":
        nextDir = Dir.Down; break
      case "ArrowLeft":
        nextDir = Dir.Left; break
      default: return
    }
    if (!Dir.isBackwards(this.state.dir, nextDir)) {
      this.setState({ nextDir })
    }
  }

  componentDidMount() {
    this.start()
    window.addEventListener("keypress", this.handleKeys)
  }

  componentWillUnmount() {
    window.removeEventListener("keypress", this.handleKeys)
  }

  render() {
    return (
      <div>
        <Info
          length={this.state.pieces.size}
          {...ctx}
          {...this.state}
        />
        <Field {...ctx}>
          {this.state.food && <Pix color="green" {...this.state.food} {...ctx} />}
          <Snake {...ctx} {...this.state} />
        </Field>
        <button onClick={() => this.start()}>Reset</button>
        <button onClick={() => this.stop()}>Stop</button>
      </div>
    )
  }
}
