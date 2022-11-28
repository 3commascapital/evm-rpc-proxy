import errorHandler from "errorhandler"

import { app } from "./app"
import * as router from "./router"

/**
 * Error Handler. Provides full stack - remove for production
 */
app.use(errorHandler())
app.use(router.http)
app.use(router.ws)

export default app