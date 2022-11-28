import express from "express"
import * as http from "http"
import expressWs from "express-ws"

const app = express()
const server = http.createServer(app)
expressWs(app, server)

export {
  app,
  server,
}
