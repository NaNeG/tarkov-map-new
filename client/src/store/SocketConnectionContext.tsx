import React from "react";
import { SocketContext } from "../types/session.type";

const SocketConnectionContext = React.createContext<SocketContext>({
  sessionId: '',
  userId: '',
  map: '',
  users: []
});

export default SocketConnectionContext;