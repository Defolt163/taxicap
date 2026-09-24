// hooks/useSocket.js
/* import { useEffect, useRef } from "react";
import { io } from "socket.io-client";
const {WS_IP, WS_PORT} = process.env;
const useSocket = (userData) => {
  const socketRef = useRef(null);

  useEffect(() => {
    const socket = io(`http://localhost:8080/ws`);
    socketRef.current = socket;

    return () => {
      socket.disconnect();
    };
  }, []);

  return socketRef;
};

export default useSocket; */
/* 
import { useEffect, useRef } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

const { WS_IP, WS_PORT } = process.env;

const useSocket = (userData) => {
  const socketUrl = `/ws`;
  const stompClientRef = useRef(null);

  useEffect(() => {
    // Создаем клиент STOMP
    const client = new Client({
      webSocketFactory: () => new SockJS(socketUrl),
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      onConnect: () => {
        console.log("✅ Connected to WebSocket");
      },
      onDisconnect: () => {
        console.log("❌ Disconnected from WebSocket");
      },
      onStompError: (frame) => {
        console.error("STOMP error:", frame);
      }
    });

    client.activate();
    stompClientRef.current = client;

    return () => {
      if (stompClientRef.current) {
        stompClientRef.current.deactivate();
      }
    };
  }, []);

  return stompClientRef;
};

export default useSocket; */

import { useEffect, useRef, useState } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { usePopup } from "./PopupContext";

const SECRET_KEY = process.env.JWT_SECRET_KEY;

const useSocket = ({onOrderCreated,
    onOrderAccepted,
    onOrderClaimed,
    onOrderCanceled,
    onOrderInWork,
    onOrderCompleted,
    onNewOrder,
    onDriverLocation,
    onOrderCanceledByDriver }) => {
      const [isConnected, setIsConnected] = useState(false)
      const stompClientRef = useRef(null);
      const handlersRef = useRef({});

      handlersRef.current = {
        onOrderCreated,
        onOrderAccepted,
        onOrderClaimed,
        onOrderCanceled,
        onOrderInWork,
        onOrderCompleted,
        onNewOrder,
        onDriverLocation,
        onOrderCanceledByDriver,
      };

      useEffect(() => {
        const token = Cookies.get("token");

        const client = new Client({
          webSocketFactory: () => new SockJS("/ws"),
          connectHeaders: {
            Authorization: `Bearer ${token}`,
          },

          reconnectDelay: 5000,

          onConnect: () => {
            console.log("CONNECTED");
            setIsConnected(true);

            client.subscribe("/user/queue/orderCreated", (msg) => {
                const orderId = Number(msg.body);

                console.log("USER CREATED:", orderId);

                handlersRef.current.onOrderCreated?.(Number(msg.body));

                /* if (onOrderCreated) {
                    onOrderCreated(orderId);
                } */
            });

            client.subscribe("/user/queue/orderCanceled", (msg) => {
              handlersRef.current.onOrderCanceled?.(Number(msg.body));
              console.log("ORDER CANCELED:", msg.body);
            });

            const payload = jwtDecode(token);

            client.subscribe("/user/queue/orderAccepted", (msg) => {
                const order = JSON.parse(msg.body);
                console.log("ORDER ACCEPTED", order);
                handlersRef.current.onOrderAccepted?.(order);
            });

            client.subscribe("/topic/orderAccepted", (msg) => {
              handlersRef.current.onOrderClaimed?.(Number(msg.body));
            });

            client.subscribe("/user/queue/inTime", (msg) => {
              const order = JSON.parse(msg.body);
              handlersRef.current.onOrderInWork?.(order);
              console.log("ORDER in work:", msg.body);
            });

            client.subscribe(`/user/queue/driverLocation`, (msg) => {
                const location = JSON.parse(msg.body);
                console.log("📍 DRIVER LOCATION (user queue):", location);
                handlersRef.current.onDriverLocation?.(location);
            });

            client.subscribe("/user/queue/orderCanceledByDriver", (msg) => {
                const orderId = Number(msg.body);
                console.log("❌ Order canceled by driver:", orderId);
                handlersRef.current.onOrderCanceledByDriver?.(orderId);
            });

            client.subscribe("/user/queue/orderCompleted", (msg) => {
                const orderId = Number(msg.body);
                console.log("✅ Order completed:", orderId);
                handlersRef.current.onOrderCompleted?.(orderId);
            });

            // Подписка на общий топик завершения
            client.subscribe("/topic/orderCompleted", (msg) => {
                const orderId = Number(msg.body);
                console.log("✅ Order completed (topic):", orderId);
                handlersRef.current.onOrderCompleted?.(orderId);
            });

            /* if (role === 0) {
              client.subscribe("/topic/orders", (msg) => {
                const orderId = JSON.parse(msg.body);
                console.log("ORDER CREATED:", orderId);
                onOrderCreated?.(orderId);
              });
            } */

            if (payload.role === 1) {
              client.subscribe("/topic/orders", (msg) => {
                console.log("NEW ORDER:", msg.body);
                handlersRef.current.onOrderCreated?.(Number(msg.body));
              });
            }

            handlersRef.current.onNewOrder?.();
          },
          onWebSocketClose: () => setIsConnected(false),
          onDisconnect: () => setIsConnected(false),
        });

        client.activate();
        stompClientRef.current = client;

        return () => client.deactivate();
  }, []);

  return stompClientRef;
};

export default useSocket;