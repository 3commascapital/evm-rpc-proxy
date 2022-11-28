import server from "../server"
import * as config from "../config"

const port = server.get("port") || config.port
server.listen(port, () => {
  console.log(`listening on port: ${port}`)
})
