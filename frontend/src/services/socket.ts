import { BACKEND_SERVER, SOCKETIO_ENDPOINT } from "@/config";
import { io, Socket } from "socket.io-client";

type SocketListener = (...args: any[]) => void;

export class SocketConnection {
  private socket: Socket | null = null;

  private listeners = new Map<string, Set<SocketListener>>();

  public connect() {
    if (this.socket) {
      if (!this.socket.connected) {
        this.socket.connect();
      }
      return;
    }

    this.disconnect();

    this.socket = io(`${BACKEND_SERVER}`, {
      path: SOCKETIO_ENDPOINT,
      autoConnect: false,
      transports: ["websocket"],
    });

    this.socket.onAny((event, ...payload) => {
      this.dispatch(event, ...payload);
    });
    this.socket.on("connect", () => {
      console.log("Socket connected");
      this.dispatch("connect");
    });
    this.socket.on("disconnect", (reason) => {
      console.log("Socket disconnected", reason);
      this.dispatch("disconnect", reason);
    });
    this.socket.on("connect_error", (error) => {
      console.error("Socket connection error", error);
      this.dispatch("connect_error", error);
    });

    this.socket.connect();
  }

  public disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  public isConnected() {
    return this.socket?.connected ?? false;
  }

  public on(event: string, listener: SocketListener) {
    const listeners = this.listeners.get(event) ?? new Set<SocketListener>();
    listeners.add(listener);
    this.listeners.set(event, listeners);

    return () => {
      const currentListeners = this.listeners.get(event);
      if (!currentListeners) {
        return;
      }

      currentListeners.delete(listener);

      if (currentListeners.size === 0) {
        this.listeners.delete(event);
      }
    };
  }

  public emit(event: string, payload?: any, ack?: (...args: any[]) => void) {
    if (!this.socket) {
      return;
    }

    if (typeof ack === "function") {
      this.socket.emit(event, payload, ack);
      return;
    }

    // console.log("Emitting", event, payload);

    this.socket.emit(event, payload);
  }

  private dispatch(event: string, ...args: any[]) {
    const listeners = this.listeners.get(event);
    if (!listeners) {
      return;
    }

    listeners.forEach((listener) => {
      listener(...args);
    });
  }
}

let conn: SocketConnection | null = null;

export const getSocket = (): SocketConnection => {
  if (!conn) {
    conn = new SocketConnection();
  }
  return conn;
};
