import { Router } from "express"
import httpProxy from "./http"
import wsRouter from "./ws"

const http = Router()
const ws = Router()

http.use(httpProxy.middleware())
ws.use("/ws", wsRouter)

export {
  http,
  ws,
}
