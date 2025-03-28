import { Movie } from "../entities";
import { Hall } from "../entities";
import { Session } from "../entities";
import { AppDataSource } from "@/config/db";

async function seedDatabase() {
  const dataSource = AppDataSource;

  try {
    // Initialize the data source
    await dataSource.initialize();
    console.log("Database connection established.");

    // Get repositories
    const movieRepository = dataSource.getRepository(Movie);
    const hallRepository = dataSource.getRepository(Hall);
    const sessionRepository = dataSource.getRepository(Session);

    // Seed Movies
    const movies = [
      {
        title: "The Matrix",
        description: "A sci-fi action movie",
        duration: 136,
      },
      {
        title: "Inception",
        description: "A mind-bending thriller",
        duration: 148,
      },
    ];
    await movieRepository.save(movies);
    console.log("Movies seeded.");

    // Seed Halls
    const halls = [
      { name: "Hall 1", rows: 10, seatsPerRow: 10 },
      { name: "Hall 2", rows: 8, seatsPerRow: 12 },
    ];
    await hallRepository.save(halls);
    console.log("Halls seeded.");

    // Seed Sessions
    const seededMovies = await movieRepository.find();
    const seededHalls = await hallRepository.find();

    const sessions = [
      {
        movie: seededMovies[0],
        movieId: seededMovies[0].id,
        hall: seededHalls[0],
        hallId: seededHalls[0].id,
        startTime: new Date("2025-03-28T19:00:00Z"),
        endTime: new Date("2025-03-28T21:16:00Z"), // start + 136 min
      },
      {
        movie: seededMovies[1],
        movieId: seededMovies[1].id,
        hall: seededHalls[1],
        hallId: seededHalls[1].id,
        startTime: new Date("2025-03-28T21:00:00Z"),
        endTime: new Date("2025-03-28T23:28:00Z"), // start + 148 min
      },
    ];
    await sessionRepository.save(sessions);
    console.log("Sessions seeded.");

    console.log("Database seeding completed successfully.");
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    await dataSource.destroy();
    console.log("Database connection closed.");
  }
}

// Run the seeder
seedDatabase();
