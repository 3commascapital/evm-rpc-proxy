const {
  RPC_WS,
  RPC_HTTP,
  PORT,
} = process.env

export const port = PORT

export const relay = {
  ws: {
    url: RPC_WS,
  },
  http: {
    url: RPC_HTTP,
  },
}
