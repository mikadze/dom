import { Request, Response } from "express";
import {
  SessionService,
  DITOKEN as SESSION_SERVICE_TOKEN,
} from "../services/session.service";
import { DITOKEN as SESSION_REPO_TOKEN } from "../repos/session.repo";
import { Logger } from "winston";
import Container from "typedi";

export class SessionController {
  private sessionService: SessionService;
  private logger: Logger;

  constructor() {
    const loggerInstance: Logger = Container.get("logger");
    const SessionServiceClass = Container.get(SESSION_SERVICE_TOKEN);
    const SessionRepoClass = Container.get(SESSION_REPO_TOKEN);
    const SessionRepoInstance = new SessionRepoClass();

    this.sessionService = new SessionServiceClass(
      SessionRepoInstance,
      loggerInstance
    );

    this.logger = loggerInstance;

    // bind
    this.create = this.create.bind(this);
    this.getAll = this.getAll.bind(this);
    this.getById = this.getById.bind(this);
    this.update = this.update.bind(this);
    this.delete = this.delete.bind(this);
  }

  async create(req: Request, res: Response) {
    try {
      const { movieId, hallId, startTime } = req.body;
      if (!movieId || !hallId || !startTime) {
        return res.status(400).json({
          error: "movieId, hallId, and startTime are required",
        }) as unknown as void;
      }
      const session = await this.sessionService.createSession({
        movieId,
        hallId,
        startTime: new Date(startTime),
      });
      return res.status(201).json(session) as unknown as void;
    } catch (error) {
      return res
        .status(500)
        .json({ error: "Failed to create session" }) as unknown as void;
    }
  }

  async getAll(_: Request, res: Response) {
    try {
      const sessions = await this.sessionService.getAllSessions();
      return res.json(sessions) as unknown as void;
    } catch (error) {
      return res
        .status(500)
        .json({ error: "Failed to fetch sessions" }) as unknown as void;
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id, 10);
      const session = await this.sessionService.getSessionById(id);
      if (!session)
        return res
          .status(404)
          .json({ error: "Session not found" }) as unknown as void;
      return res.json(session) as unknown as void;
    } catch (error) {
      return res
        .status(500)
        .json({ error: "Failed to fetch session" }) as unknown as void;
    }
  }

  async update(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id, 10);
      const { movieId, hallId, startTime } = req.body;
      const session = await this.sessionService.updateSession(id, {
        movieId,
        hallId,
        startTime: startTime ? new Date(startTime) : undefined,
      });
      if (!session)
        return res
          .status(404)
          .json({ error: "Session not found" }) as unknown as void;
      return res.json(session) as unknown as void;
    } catch (error) {
      return res
        .status(500)
        .json({ error: "Failed to update session" }) as unknown as void;
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id, 10);
      const success = await this.sessionService.deleteSession(id);
      if (!success)
        return res
          .status(404)
          .json({ error: "Session not found" }) as unknown as void;
      return res.status(204).send() as unknown as void;
    } catch (error) {
      return res
        .status(500)
        .json({ error: "Failed to delete session" }) as unknown as void;
    }
  }
}
