import { User } from "./user.type"

export type SocketContext = {
  sessionId: string,
  userId: string,
  users: User[],
  socket?: WebSocket,
  map: string
  setSessionId?: (id: string) => void;
  setUsers?: (users: User[]) => void;
}