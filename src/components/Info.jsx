import * as React from "react"
import { Dir } from "../model"

export const Info = ({ length, dir, /* nextDir, */ scale, width, border/* , gameOver */ }) =>
  <div style={{
    background: "lightgray",
    padding: "15px",
    width: width * scale + border * 2,
    display: "flex",
    justifyContent: "space-between",
  }}>
    <div>Length: {length}</div>
    <div>Direction: {Dir[dir]}</div>
    {/* <div>Next Direction: {Dir[nextDir]}</div>
    <div>Game Over: {String(gameOver)}</div> */}
  </div>
