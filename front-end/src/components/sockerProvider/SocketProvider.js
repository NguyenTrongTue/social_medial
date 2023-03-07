import { createContext } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext();
export default function SocketProvider({ children }) {
  const socket = io("http://localhost:8900");

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
}

export { SocketContext };
