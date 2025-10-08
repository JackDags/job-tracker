import { Entry } from "./types";

export const isEntry = (obj: any): obj is Entry => {
  return (
    obj &&
    typeof obj === "object" &&
    "company" in obj &&
    "position" in obj &&
    "status" in obj &&
    "date" in obj
  )
}