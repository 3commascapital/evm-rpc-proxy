import * as express from "express"

export const authenticate = async (req: express.Request): Promise<boolean> => {
  if (req.params.key !== "valid") {
    return false
  }
  return true
}
