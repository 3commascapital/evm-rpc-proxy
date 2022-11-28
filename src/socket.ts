import * as debug from "./debug"
import WebSocket from "ws"
import * as config from "./config"
console.log("ws rpc", config.relay.ws.url)

const waitForOpen = (client: WebSocket): Promise<void> => new Promise((resolve, reject) => {
  const handleError = (err: Error) => {
    debug.relay("error during connect", err)
    client.off("open", resolve)
    reject(err)
  }
  client.once("open", () => {
    client.off("error", handleError)
    resolve()
  })
  client.once("error", handleError)
})

export const isClosing = (socket: WebSocket) => socket.readyState === WebSocket.CLOSING || socket.readyState === WebSocket.CLOSED

export class RelayWebSocket {
  socket: WebSocket
  promises: {
    [key: string]: Promise<void>
  }
  constructor() {
    this.socket = new WebSocket(config.relay.ws.url)
    this.promises = {}
    this.promises.isOpen = waitForOpen(this.socket)
  }
  async waitUntilOpen(client: WebSocket): Promise<void> {
    const { readyState } = this.socket
    try {
      if (readyState !== WebSocket.OPEN && readyState !== WebSocket.CONNECTING) {
        this.promises.isOpen = waitForOpen(this.socket)
      }
      // resolves instantly because should be cached
      await this.promises.isOpen
    } catch (err) {
      client.close()
      throw err
    }
  }
  on(eventName: string | symbol, handler: (result: WebSocket.Data) => void) {
    this.socket.on(eventName, handler)
    return this
  }
  once(eventName: string | symbol, handler: (result: WebSocket.Data) => void) {
    this.socket.once(eventName, handler)
    return this
  }
  send(msg: WebSocket.Data, options?: object) {
    this.socket.send(msg, options || {})
  }
  close() {
    if (isClosing(this.socket)) {
      return
    }
    this.socket.close()
  }
}
