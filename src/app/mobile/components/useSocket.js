// hooks/useSocket.js
import { useEffect, useRef } from "react";
import { io } from "socket.io-client";

const useSocket = (userData) => {
  const socketRef = useRef(null);

  useEffect(() => {
    const socket = io("http://192.168.1.147:3001");
    socketRef.current = socket;

    return () => {
      socket.disconnect();
    };
  }, []);

  return socketRef;
};

export default useSocket;
