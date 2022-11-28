import { RelayWebSocket, isClosing } from "./socket"
import express from "express"
import _ from "lodash"
import * as middleware from "./middleware"

const router = express.Router()

router.ws("/v1/:key", async (client, req) => {
  const rpc = new RelayWebSocket()
  // auth can be checked later
  client.once("close", () => rpc.close())
  rpc.once("close", () => !isClosing(client) && client.close())
  rpc.on("message", msg => {
    client.send(msg.toString())
  })
  client.on("message", async (msg) => {
    try {
      // should already be resolved
      await rpc.waitUntilOpen(client)
    } catch (err) {
      return client.send((err as Error).toString())
    }
    // forward unedited message to rpc
    rpc.send(msg)
  })
  await middleware.authenticate(req)
})

export default router
