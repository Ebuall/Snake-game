import * as React from "react"

export const Pix = ({ color, scale, x, y }) =>
  <div style={{
    background: color,
    border: scale / 10 + "px solid gray",
    position: "absolute",
    left: x * scale,
    bottom: y * scale,
    height: +scale,
    width: +scale,
  }}>
  </div>
