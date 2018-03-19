import * as React from "react"
import { Pix } from "./Pix"

export class Snake extends React.Component {
  render() {
    return (
      <React.Fragment>
        {this.props.pieces.map(point =>
          <Pix
            key={point.x + "." + point.y}
            color="blue"
            {...point}
            scale={this.props.scale} />)}
      </React.Fragment>
    )
  }
}
