import { EntityManager, Repository } from "typeorm";
import { AppDataSource } from "@/config/db";
import { Session } from "@/db/entities";
import { Token } from "typedi";

export const DITOKEN = new Token<new () => SessionRepository>(
  "SESSION_REPO_TOKEN"
);

export class SessionRepository {
  private sessionRepository: Repository<Session>;

  constructor() {
    this.sessionRepository = AppDataSource.getRepository(Session);
  }

  async createSession(
    data: Partial<Session>,
    entityManager?: EntityManager
  ): Promise<Session> {
    let repo = this.sessionRepository;
    if (entityManager) {
      repo = entityManager.getRepository(Session);
    }

    const session = repo.create(data);
    return repo.save(session);
  }

  async findAllSessions(): Promise<Session[]> {
    return this.sessionRepository.find({ relations: ["movie", "hall"] });
  }

  async findSessionById(id: number): Promise<Session | null> {
    return this.sessionRepository.findOne({
      where: { id },
      relations: ["movie", "hall"],
    });
  }

  async updateSession(
    id: number,
    data: Partial<Session>,
    entityManager?: EntityManager
  ): Promise<Session | null> {
    let repo = this.sessionRepository;
    if (entityManager) {
      repo = entityManager.getRepository(Session);
    }

    const session = await this.findSessionById(id);
    if (!session) return null;
    Object.assign(session, data);
    return repo.save(session);
  }

  async deleteSession(id: number): Promise<boolean> {
    const result = await this.sessionRepository.delete(id);
    return result.affected === 1;
  }
}
