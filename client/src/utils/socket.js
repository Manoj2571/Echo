import { io } from "socket.io-client";

let socket;

export const initSocket = (user) => {
  if (!socket) {
    socket = io("https://echosocketserver-production.up.railway.app", {
      auth: { userId: user._id },
    });

    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected");
    });
  }
};

export const getSocket = () => socket;
