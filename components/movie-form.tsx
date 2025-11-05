"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Movie } from "@/lib/types";

interface MovieFormProps {
  initialData?: Movie;
  onSubmit: (
    data: Omit<Movie, "id" | "reviewCount" | "averageReviewRating">
  ) => Promise<void>;
  isSubmitting: boolean;
}

const ALL_GENRES = [
  "Action",
  "Adventure",
  "Animation",
  "Biography",
  "Comedy",
  "Crime",
  "Drama",
  "Family",
  "Fantasy",
  "Film-Noir",
  "History",
  "Horror",
  "Musical",
  "Mystery",
  "Romance",
  "Sci-Fi",
  "Sport",
  "Thriller",
  "War",
  "Western",
];

export function MovieForm({
  initialData,
  onSubmit,
  isSubmitting,
}: MovieFormProps) {
  const [formData, setFormData] = useState({
    title: "",
    year: new Date().getFullYear(),
    genre: [] as string[],
    rating: 0,
    director: "",
    runtime: 0,
    synopsis: "",
    cast: [] as string[],
    posterUrl: "",
  });

  const [genreInput, setGenreInput] = useState("");
  const [castInput, setCastInput] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title,
        year: initialData.year,
        genre: initialData.genre,
        rating: initialData.rating,
        director: initialData.director,
        runtime: initialData.runtime,
        synopsis: initialData.synopsis,
        cast: initialData.cast,
        posterUrl: initialData.posterUrl,
      });
    }
  }, [initialData]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (formData.year < 1800 || formData.year > new Date().getFullYear() + 5)
      newErrors.year = "Invalid year";
    if (formData.genre.length === 0)
      newErrors.genre = "At least one genre is required";
    if (formData.rating < 0 || formData.rating > 10)
      newErrors.rating = "Rating must be between 0 and 10";
    if (!formData.director.trim()) newErrors.director = "Director is required";
    if (formData.runtime <= 0)
      newErrors.runtime = "Runtime must be greater than 0";
    if (!formData.synopsis.trim()) newErrors.synopsis = "Synopsis is required";
    if (formData.cast.length === 0)
      newErrors.cast = "At least one cast member is required";
    if (!formData.posterUrl.trim())
      newErrors.posterUrl = "Poster URL is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      await onSubmit({
        title: formData.title,
        year: formData.year,
        genre: formData.genre,
        rating: formData.rating,
        director: formData.director,
        runtime: formData.runtime,
        synopsis: formData.synopsis,
        cast: formData.cast,
        posterUrl: formData.posterUrl,
      });
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const handleAddGenre = () => {
    if (genreInput && !formData.genre.includes(genreInput)) {
      setFormData({
        ...formData,
        genre: [...formData.genre, genreInput],
      });
      setGenreInput("");
    }
  };

  const handleRemoveGenre = (genre: string) => {
    setFormData({
      ...formData,
      genre: formData.genre.filter((g) => g !== genre),
    });
  };

  const handleAddCast = () => {
    if (castInput && !formData.cast.includes(castInput)) {
      setFormData({
        ...formData,
        cast: [...formData.cast, castInput],
      });
      setCastInput("");
    }
  };

  const handleRemoveCast = (cast: string) => {
    setFormData({
      ...formData,
      cast: formData.cast.filter((c) => c !== cast),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <Label
            htmlFor="title"
            className="text-sm font-medium text-gray-300 mb-1 block"
          >
            Title
          </Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            placeholder="Movie title"
            disabled={isSubmitting}
            className={`${errors.title ? "border-red-500" : ""} text-gray-300`}
          />
          {errors.title && (
            <p className="text-sm text-red-600 mt-1">{errors.title}</p>
          )}
        </div>

        <div>
          <Label
            htmlFor="year"
            className="text-sm font-medium text-gray-300 mb-1 block"
          >
            Year
          </Label>
          <Input
            id="year"
            type="number"
            value={formData.year}
            onChange={(e) =>
              setFormData({ ...formData, year: parseInt(e.target.value, 10) })
            }
            placeholder="1999"
            disabled={isSubmitting}
            className={`${errors.year ? "border-red-500" : ""} text-gray-300`}
          />
          {errors.year && (
            <p className="text-sm text-red-600 mt-1">{errors.year}</p>
          )}
        </div>

        <div>
          <Label
            htmlFor="director"
            className="text-sm font-medium text-gray-300 mb-1 block"
          >
            Director
          </Label>
          <Input
            id="director"
            value={formData.director}
            onChange={(e) =>
              setFormData({ ...formData, director: e.target.value })
            }
            placeholder="Director name"
            disabled={isSubmitting}
            className={`${
              errors.director ? "border-red-500" : ""
            } text-gray-300`}
          />
          {errors.director && (
            <p className="text-sm text-red-600 mt-1">{errors.director}</p>
          )}
        </div>

        <div>
          <Label
            htmlFor="runtime"
            className="text-sm font-medium text-gray-300 mb-1 block"
          >
            Runtime (minutes)
          </Label>
          <Input
            id="runtime"
            type="number"
            value={formData.runtime}
            onChange={(e) =>
              setFormData({
                ...formData,
                runtime: parseInt(e.target.value, 10),
              })
            }
            placeholder="120"
            disabled={isSubmitting}
            className={`${
              errors.runtime ? "border-red-500" : ""
            } text-gray-300`}
          />
          {errors.runtime && (
            <p className="text-sm text-red-600 mt-1">{errors.runtime}</p>
          )}
        </div>

        <div>
          <Label
            htmlFor="rating"
            className="text-sm font-medium text-gray-300 mb-1 block"
          >
            Rating (0-10)
          </Label>
          <Input
            id="rating"
            type="number"
            step="0.1"
            value={formData.rating}
            onChange={(e) =>
              setFormData({ ...formData, rating: parseFloat(e.target.value) })
            }
            placeholder="8.5"
            disabled={isSubmitting}
            className={`${errors.rating ? "border-red-500" : ""} text-gray-300`}
          />
          {errors.rating && (
            <p className="text-sm text-red-600 mt-1">{errors.rating}</p>
          )}
        </div>

        <div>
          <Label
            htmlFor="posterUrl"
            className="text-sm font-medium text-gray-300 mb-1 block"
          >
            Poster URL
          </Label>
          <Input
            id="posterUrl"
            value={formData.posterUrl}
            onChange={(e) =>
              setFormData({ ...formData, posterUrl: e.target.value })
            }
            placeholder="https://..."
            disabled={isSubmitting}
            className={`${
              errors.posterUrl ? "border-red-500" : ""
            } text-gray-300`}
          />
          {errors.posterUrl && (
            <p className="text-sm text-red-600 mt-1">{errors.posterUrl}</p>
          )}
        </div>
      </div>

      <div>
        <Label
          htmlFor="synopsis"
          className="text-sm font-medium text-gray-300 mb-1 block"
        >
          Synopsis
        </Label>
        <Textarea
          id="synopsis"
          value={formData.synopsis}
          onChange={(e) =>
            setFormData({ ...formData, synopsis: e.target.value })
          }
          placeholder="Movie synopsis"
          rows={4}
          disabled={isSubmitting}
          className={`${errors.synopsis ? "border-red-500" : ""} text-gray-300`}
        />
        {errors.synopsis && (
          <p className="text-sm text-red-600 mt-1">{errors.synopsis}</p>
        )}
      </div>

      <div>
        <Label className="text-sm font-medium text-gray-300 mb-2 block">
          Genres
        </Label>
        <div className="flex gap-2 mb-2">
          <select
            value={genreInput}
            onChange={(e) => setGenreInput(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none text-gray-200"
            disabled={isSubmitting}
          >
            <option className="text-black" value="">
              Select genre
            </option>
            {ALL_GENRES.map((genre) => (
              <option className="text-black" key={genre} value={genre}>
                {genre}
              </option>
            ))}
          </select>
          <Button
            type="button"
            onClick={handleAddGenre}
            disabled={!genreInput || isSubmitting}
            className="bg-white text-black hover:bg-gray-200 cursor-pointer"
          >
            Add
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {formData.genre.map((genre) => (
            <div
              key={genre}
              className="bg-gray-700 text-gray-300 px-3 py-1 rounded-full text-sm flex items-center gap-2"
            >
              {genre}
              <button
                type="button"
                onClick={() => handleRemoveGenre(genre)}
                disabled={isSubmitting}
                className="font-bold hover:text-gray-400 cursor-pointer"
              >
                ×
              </button>
            </div>
          ))}
        </div>
        {errors.genre && (
          <p className="text-sm text-red-600 mt-1">{errors.genre}</p>
        )}
      </div>

      <div>
        <Label className="text-sm font-medium text-gray-300 mb-2 block">
          Cast
        </Label>
        <div className="flex gap-2 mb-2">
          <Input
            value={castInput}
            onChange={(e) => setCastInput(e.target.value)}
            placeholder="Actor name"
            disabled={isSubmitting}
            onKeyDown={(e) =>
              e.key === "Enter" && (e.preventDefault(), handleAddCast())
            }
            className="text-gray-200"
          />
          <Button
            type="button"
            onClick={handleAddCast}
            disabled={!castInput || isSubmitting}
            className="bg-white text-black hover:bg-gray-200 cursor-pointer"
          >
            Add
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {formData.cast.map((actor) => (
            <div
              key={actor}
              className="bg-gray-700 text-gray-300 px-3 py-1 rounded-full text-sm flex items-center gap-2"
            >
              {actor}
              <button
                type="button"
                onClick={() => handleRemoveCast(actor)}
                disabled={isSubmitting}
                className="font-bold hover:text-gray-400 cursor-pointer"
              >
                ×
              </button>
            </div>
          ))}
        </div>
        {errors.cast && (
          <p className="text-sm text-red-600 mt-1">{errors.cast}</p>
        )}
      </div>

      <div className="flex gap-2 pt-4">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="bg-white text-black hover:bg-gray-200 cursor-pointer flex-1"
        >
          {isSubmitting
            ? "Saving..."
            : initialData
            ? "Update Movie"
            : "Add Movie"}
        </Button>
      </div>
    </form>
  );
}
