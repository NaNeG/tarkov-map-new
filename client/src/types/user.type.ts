import { Coordinates } from "./coordinates.type"

export type User = {
  id: number,
  userId: string,
  username: string,
  pinShown: boolean,
  pinColorId: number,
  coordinates: Coordinates
}