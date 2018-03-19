export const Dir = {
  Up: 0,
  Right: 1,
  Down: 2,
  Left: 3,
  0: "Up",
  1: "Right",
  2: "Down",
  3: "Left",

  isBackwards(a, b) {
    return Math.abs(a - b) == 2
  },
}

export const point = (x, y) => new Point(x, y)

class Point {
  constructor(x, y) {
    this.x = x
    this.y = y
  }

  move(dir, by = 1) {
    const { x, y } = this
    switch (dir) {
      case Dir.Up:
        return point(x, y + by)
      case Dir.Right:
        return point(x + by, y)
      case Dir.Down:
        return point(x, y - by)
      case Dir.Left:
        return point(x - by, y)
      default:
        throw new Error("Unknown direction")
    }
  }

  equals(that) {
    return this.x == that.x && this.y == that.y
  }
}
