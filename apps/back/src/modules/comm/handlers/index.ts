import { WebSocket } from "ws";
import { Logger } from "winston";
import { OutgoingEventMessage, WebSocketMessage } from "../types";

export interface MessageHandler {
  handle(ws: WebSocket, message: WebSocketMessage, logger: Logger): void;
}

export interface MessageTransformer {
  transform(message: { type: string; payload: any }): OutgoingEventMessage;
}

export class TransformerRegistry {
  private transformers: Map<string, MessageTransformer> = new Map();

  register(type: string, transformer: MessageTransformer): void {
    this.transformers.set(type, transformer);
  }

  getHandler(type: string): MessageTransformer | undefined {
    return this.transformers.get(type);
  }
}

export class HandlerRegistry {
  private handlers: Map<string, MessageHandler> = new Map();

  register(type: string, handler: MessageHandler): void {
    this.handlers.set(type, handler);
  }

  getHandler(type: string): MessageHandler | undefined {
    return this.handlers.get(type);
  }
}
