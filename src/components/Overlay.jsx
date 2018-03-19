import * as React from "react"
import { GameState } from "./Game"

const baseStyles = {
  position: "absolute",
  top: 0,
  left: 0,
  height: "100%",
  width: "100%",
  fontSize: 30,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}

export function Overlay({ gameState }) {
  switch (gameState) {
    case GameState.Init:
    case GameState.Paused:
      return (
        <div style={Object.assign({ color: "green" }, baseStyles)}>
          Press any key
        </div>
      )
    case GameState.Playing:
      return null
    case GameState.Over:
      return (
        <div style={Object.assign({ color: "red" }, baseStyles)}>
          Game Over. Press any key
        </div>
      )
  }
}
