import * as React from "react"

import { List } from "immutable"
import { Dir, point } from "../model"
import * as Result from "../Result"
import { randomInt } from "../random"

import { Field } from "./Field"
import { Snake } from "./Snake"
import { Info } from "./Info"
import { Pix } from "./Pix"
import { Overlay } from "./Overlay"

export const GameState = {
  Init: 0,
  Playing: 1,
  Paused: 2,
  Over: 3,
}

export const ctx = {
  border: 10,
  height: 15,
  width: 20,
  scale: 25,
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

function getFreshState() {
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
    gameLoop: null,
  }
}

export class Game extends React.Component {
  constructor(props) {
    super(props)
    this.state = getFreshState()

    this.handleKeys = this.handleKeys.bind(this)
    this.tick = this.tick.bind(this)
    this.reset = this.reset.bind(this)
    this.pause = this.pause.bind(this)
    this.startLoop = this.startLoop.bind(this)
  }

  reset() {
    this.stop(GameState.Init)
    this.setState(getFreshState)
  }

  startLoop() {
    this.setState({
      gameLoop: setInterval(this.tick, ctx.timer),
      gameState: GameState.Playing,
    })
  }

  pause() {
    this.stop(GameState.Paused)
  }

  stop(gameState) {
    clearInterval(this.state.gameLoop)
    this.setState({ gameLoop: null, gameState })
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
    const dir = this.state.nextDir
    this.moveSnake(dir, this.state.pieces, this.state.food)
      .onOk(({ pieces, eatenFood }) => {
        let food = this.state.food
        if (eatenFood) {
          food = generateFood(pieces)
        }
        this.setState({ dir, pieces, food })
      })
      .onErr(e => {
        console.log(e)
        this.stop(GameState.Over)
      })
  }

  anykey(ev) {
    switch (this.state.gameState) {
      case GameState.Over:
        this.reset() // fallthrough
      case GameState.Init:
      case GameState.Paused:
        this.startLoop()
    }
  }

  handleKeys(ev) {
    this.anykey(ev)
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

    this.setState(state => {
      if (!Dir.isBackwards(state.dir, nextDir)) {
        return { nextDir }
      } else {
        return state
      }
    })
  }

  componentDidMount() {
    window.addEventListener("keypress", this.handleKeys)
  }

  componentWillUnmount() {
    window.removeEventListener("keypress", this.handleKeys)
  }

  pauseButton() {
    switch (this.state.gameState) {
      case GameState.Playing:
        return <button onClick={this.pause}>Pause</button>
      case GameState.Paused:
        return <button onClick={this.startLoop}>Resume</button>
    }
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
          <Pix color="green" {...this.state.food} {...ctx} />
          <Snake {...ctx} {...this.state} />
          <Overlay gameState={this.state.gameState} />
        </Field>
        <button onClick={this.reset}>Reset</button>
        {this.pauseButton()}
      </div>
    )
  }
}
