class Result {
  constructor(val) {
    this.val = val
  }
  isError() {
    return false
  }
  onOk(fn) {
    fn(this.val)
    return this
  }
  onErr(fn) {
    return this
  }
  map(fn) {
    if (this.isError()) {
      return this
    } else {
      return Try(() => fn(this.val))
    }
  }
  flatMap(fn) {
    if (this.isError()) {
      return this
    } else {
      const res = fn(this.val)
      if (!res.isError) {
        throw new Error("TypeError. Result.flatMap mapping function should return Result")
      } else {
        return res
      }
    }
  }
  unwrap() {
    if (this.isError()) {
      throw this.val
    } else {
      return this.val
    }
  }
  getOrElse(thunk) {
    if (this.isError()) {
      return thunk()
    } else {
      return this.val
    }
  }
}

class Ok extends Result { }
export const ok = v => new Ok(v)

class Err extends Result {
  isError() {
    return true
  }
  onOk(fn) {
    return this
  }
  onErr(fn) {
    fn(this.val)
    return this
  }
}
export const err = v => new Err(v)

export function Try(thunk) {
  try {
    return ok(thunk())
  } catch (e) {
    return err(e)
  }
}
