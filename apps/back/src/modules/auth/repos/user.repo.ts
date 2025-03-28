import { EntityManager, Repository } from "typeorm";
import { AppDataSource } from "@/config/db"; // Adjust path alias as needed
import { User } from "@/db/entities"; // Adjust path alias as needed
import { Token } from "typedi";

export const DITOKEN = new Token<new () => UserRepository>("USER_REPO_TOKEN");

export class UserRepository {
  private userRepository: Repository<User>;

  constructor() {
    this.userRepository = AppDataSource.getRepository(User);
  }

  /**
   * Creates a new user in the database
   * @param name - User's name
   * @param email - User's email (must be unique)
   * @param password - User's password (should be hashed in production)
   * @returns The created User entity
   * @throws Error if the operation fails (e.g., duplicate email)
   */
  async createUser({
    name,
    email,
    password,
    salt,
    entityManager,
  }: {
    name: string;
    email: string;
    salt: string;
    password: string;
    entityManager?: EntityManager;
  }): Promise<User> {
    let repo = this.userRepository;

    if (entityManager) {
      repo = entityManager.getRepository(User);
    }

    const user = repo.create({
      name,
      email,
      salt,
      password,
    });

    // Save the user to the database
    const savedUser = await repo.save(user);
    return savedUser;
  }

  async findUserById(id: number): Promise<User | null> {
    return this.userRepository.findOne({ where: { id } });
  }
}
