import { OrderEnum } from "./enums";

export type Entry = {
  company: string,
  position: string,
  status: string,
  date: string,
}

export type Ordering = {
  [K in keyof Entry]?: OrderEnum
}
