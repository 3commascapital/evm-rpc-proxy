import * as config from "./config"
import express from "express"
import _ from "lodash"
import rocky from "rocky"
import { URL } from "url"
import * as middleware from "./middleware"
import * as boom from "@hapi/boom"

console.log("http rpc", config.relay.http.url)
const url = new URL(config.relay.http.url)

const proxy = rocky({
  target: url.href,
  changeOrigin: true,
  ignorePath: true,
  rewriteProtocol: true,
})

proxy.all("/v1/:key")
  .transformRequest(async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    if (!(await middleware.authenticate(req))) {
      throw boom.unauthorized()
    }
    // should be constrained by ip address in same vpc
    delete req.headers.authorization
    delete req.headers["x-forwarded-for"]
    next()
  })

export default proxy
