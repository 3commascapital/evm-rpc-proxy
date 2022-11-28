import Debug from "debug"
const relay = logger("relay")

export {
  relay,
}

function logger(key: string) {
  const l = Debug(key)
  return (msg: string, options?: any) => options ? l(`${msg} %o`, options) : l(msg)
}
