import * as React from "react"

export class Field extends React.Component {
  render() {
    return (
      <div style={{
        border: this.props.border + "px solid black",
        boxSizing: "content-box",
        position: "relative",
        height: this.props.height * this.props.scale,
        width: this.props.width * this.props.scale,
      }}>
        {this.props.children}
      </div>
    )
  }
}
