import { Server, WebSocket } from "ws";
import { Logger } from "winston";
import { Container } from "typedi";
import { Server as HttpServer } from "http";
import { HandlerRegistry, TransformerRegistry } from "../handlers";
import {
  CLOSE_EVENT,
  CONNECTION_EVENT,
  ERROR_EVENT,
  EXPIRED_BOOKINGS,
  InternalEvent,
  MESSAGE_EVENT,
  OutgoingEventMessage,
  WebSocketMessage,
} from "../types";
import { ExpireTransformer } from "../handlers/expire.handler";

export class CommunicationService {
  private readonly logger: Logger;
  private wss: Server;
  //   private connections: Map<number, WebSocket> = new Map();
  private connections: WebSocket[] = []; // allow connections without login
  private handlerRegistry: HandlerRegistry;
  private transformerRegistry: TransformerRegistry;

  constructor(httpServer: HttpServer) {
    this.logger = Container.get("logger");
    this.wss = new WebSocket.Server({ server: httpServer });
    this.handlerRegistry = new HandlerRegistry();
    this.transformerRegistry = new TransformerRegistry();
    this.setupHandlers();
    this.setupTransformers();
    this.setupWebSocket();
  }

  private setupHandlers() {}

  private setupTransformers() {
    this.transformerRegistry.register(
      EXPIRED_BOOKINGS,
      new ExpireTransformer()
    );
  }

  private setupWebSocket() {
    this.wss.on(CONNECTION_EVENT, (ws: WebSocket) => {
      this.logger.info("New WebSocket connection established");

      this.connections.push(ws);

      ws.on(MESSAGE_EVENT, (message: string) => {
        try {
          const data: WebSocketMessage = JSON.parse(message);
          const handler = this.handlerRegistry.getHandler(data.type);
          if (handler) {
            handler.handle(ws, data, this.logger);
          } else {
            this.logger.warn(`No handler for message type: ${data.type}`, {
              message,
            });
          }
        } catch (error) {
          this.logger.error("Error processing WebSocket message", {
            error,
            message,
          });
          ws.close(1003, "Invalid message format");
        }
      });

      ws.on(ERROR_EVENT, (error) => {
        this.logger.error("WebSocket error", { error });
      });

      ws.on(CLOSE_EVENT, () => {
        const index = this.connections.indexOf(ws);
        if (index !== -1) {
          this.connections.splice(index, 1);
        }
      });
    });

    this.wss.on(ERROR_EVENT, (error) => {
      this.logger.error("WebSocket Server error", { error });
    });
  }

  // Emit event to all connected users
  emitToAll(data: InternalEvent): void {
    const transformer = this.transformerRegistry.getHandler(data.type);
    let payload: InternalEvent | OutgoingEventMessage = data;
    const event = data.type;

    if (transformer) {
      payload = transformer.transform(data);
    }

    this.connections.forEach((ws) => {
      if (ws.readyState === WebSocket.OPEN) {
        const handler = this.handlerRegistry.getHandler(data.type);
        if (handler) {
          handler.handle(ws, data, this.logger);
        } else {
          ws.send(JSON.stringify(payload));
        }

        this.logger.info(`Emitted event ${event}`, {
          data,
        });
      }
    });

    this.logger.info(
      `Emitted event ${event} to ${this.connections.length} users`
    );
  }
}

export default function initializeCommunicationService(httpServer: HttpServer) {
  Container.set("communicationService", new CommunicationService(httpServer));
}
