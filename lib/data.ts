import fs from "fs";
import path from "path";
import { Movie, Review } from "./types";

const moviesPath = path.join(process.cwd(), "data", "movies.json");
const reviewsPath = path.join(process.cwd(), "data", "reviews.json");

function readMovies(): Movie[] {
  try {
    const data = fs.readFileSync(moviesPath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading movies.json:", error);
    return [];
  }
}

function readReviews(): Review[] {
  try {
    const data = fs.readFileSync(reviewsPath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading reviews.json:", error);
    return [];
  }
}

function writeMovies(movies: Movie[]): void {
  try {
    fs.writeFileSync(moviesPath, JSON.stringify(movies, null, 2));
  } catch (error) {
    console.error("Error writing movies.json:", error);
    throw error;
  }
}

function writeReviews(reviews: Review[]): void {
  try {
    fs.writeFileSync(reviewsPath, JSON.stringify(reviews, null, 2));
  } catch (error) {
    console.error("Error writing reviews.json:", error);
    throw error;
  }
}

export function getNextMovieId(): number {
  const movies = readMovies();
  return movies.length > 0
    ? Math.max(...movies.map((m: Movie) => m.id)) + 1
    : 1;
}

export function getNextReviewId(): number {
  const reviews = readReviews();
  return reviews.length > 0
    ? Math.max(...reviews.map((r: Review) => r.id)) + 1
    : 1;
}

export function getAllMovies(): Movie[] {
  return readMovies();
}

export function getMovieById(id: number): Movie | undefined {
  const movies = readMovies();
  return movies.find((m: Movie) => m.id === id);
}

export function createMovie(movie: Omit<Movie, "id">): Movie {
  const movies = readMovies();
  const newMovie: Movie = {
    id: getNextMovieId(),
    ...movie,
  };
  movies.push(newMovie);
  writeMovies(movies);
  return newMovie;
}

export function updateMovie(
  id: number,
  updates: Partial<Omit<Movie, "id">>
): Movie | undefined {
  const movies = readMovies();
  const index = movies.findIndex((m: Movie) => m.id === id);
  if (index === -1) return undefined;

  movies[index] = { ...movies[index], ...updates };
  writeMovies(movies);
  return movies[index];
}

export function deleteMovie(id: number): boolean {
  const movies = readMovies();
  const filteredMovies = movies.filter((m: Movie) => m.id !== id);
  if (filteredMovies.length === movies.length) return false;

  writeMovies(filteredMovies);

  const reviews = readReviews();
  const filteredReviews = reviews.filter((r: Review) => r.movieId !== id);
  writeReviews(filteredReviews);

  return true;
}

export function getReviewsByMovieId(movieId: number): Review[] {
  const reviews = readReviews();
  return reviews
    .filter((r: Review) => r.movieId === movieId)
    .sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
}

export function getReviewById(id: number): Review | undefined {
  const reviews = readReviews();
  return reviews.find((r: Review) => r.id === id);
}

export function createReview(review: Omit<Review, "id">): Review {
  const reviews = readReviews();
  const newReview: Review = {
    ...review,
    id: getNextReviewId(),
  };
  reviews.push(newReview);
  writeReviews(reviews);

  const movies = readMovies();
  const movieIndex = movies.findIndex((m: Movie) => m.id === review.movieId);
  if (movieIndex !== -1) {
    const movieReviews = reviews.filter(
      (r: Review) => r.movieId === review.movieId
    );
    movies[movieIndex].reviewCount = movieReviews.length;
    movies[movieIndex].averageReviewRating =
      movieReviews.reduce((sum: number, r: Review) => sum + r.rating, 0) /
      movieReviews.length;
    writeMovies(movies);
  }

  return newReview;
}

export function updateMovieStats(movieId: number): void {
  const reviews = readReviews();
  const movieReviews = reviews.filter((r: Review) => r.movieId === movieId);

  const movies = readMovies();
  const movieIndex = movies.findIndex((m: Movie) => m.id === movieId);
  if (movieIndex !== -1) {
    movies[movieIndex].reviewCount = movieReviews.length;
    movies[movieIndex].averageReviewRating =
      movieReviews.length > 0
        ? movieReviews.reduce((sum: number, r: Review) => sum + r.rating, 0) /
          movieReviews.length
        : 0;
    writeMovies(movies);
  }
}
