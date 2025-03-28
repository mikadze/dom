import { Session } from "@/db/entities";
import { SessionRepository } from "../repos/session.repo";
import { Token } from "typedi";
import { Logger } from "winston";

export const DITOKEN = new Token<
  new (sessionRepository: SessionRepository, logger: Logger) => SessionService
>("SESSION_SERVICE_SERVICE_TOKEN");

export class SessionService {
  private sessionRepository: SessionRepository;

  constructor() {
    this.sessionRepository = new SessionRepository();
  }

  async createSession(data: Partial<Session>): Promise<Session> {
    return this.sessionRepository.createSession(data);
  }

  async getAllSessions(): Promise<Session[]> {
    return this.sessionRepository.findAllSessions();
  }

  async getSessionById(id: number): Promise<Session | null> {
    return this.sessionRepository.findSessionById(id);
  }

  async updateSession(
    id: number,
    data: Partial<Session>
  ): Promise<Session | null> {
    return this.sessionRepository.updateSession(id, data);
  }

  async deleteSession(id: number): Promise<boolean> {
    return this.sessionRepository.deleteSession(id);
  }
}
