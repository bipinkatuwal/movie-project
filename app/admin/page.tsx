"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Movie } from "@/lib/types";
import {
  fetchMovies,
  deleteMovie,
  exportMoviesCSV,
  logout,
} from "@/lib/client";
import { toast } from "sonner";
import { LogOut, Plus, Download, Trash2, Edit2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function AdminPanel() {
  const router = useRouter();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  useEffect(() => {
    loadMovies();
  }, []);

  const loadMovies = async () => {
    try {
      setLoading(true);
      const data = await fetchMovies(1, 1000);
      setMovies(data.movies);
    } catch (error) {
      console.error("Error loading movies:", error);
      toast.error("Failed to load movies");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    const data = await logout();
    toast.success(data.message);
    router.push("/admin/login");
  };

  const handleDelete = async () => {
    if (deleteId === null) return;

    try {
      await deleteMovie(deleteId);
      setMovies(movies.filter((m) => m.id !== deleteId));
      toast.success("Movie deleted successfully");
      setDeleteId(null);
    } catch (error) {
      console.error("Error deleting movie:", error);
      toast.error("Failed to delete movie");
    }
  };

  const handleExport = async () => {
    try {
      await exportMoviesCSV();
      toast.success("Movies exported to CSV");
    } catch (error) {
      console.error("Error exporting CSV:", error);
      toast.error("Failed to export CSV");
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
              Admin Panel
            </h1>
            <p className="text-gray-600 mt-1">Manage your movie database</p>
          </div>

          <div className="flex gap-2 mt-4 sm:mt-0">
            <Button asChild className="bg-teal-600 hover:bg-teal-700">
              <Link href="/admin/movies/new">
                <Plus className="w-4 h-4 mr-2" />
                Add Movie
              </Link>
            </Button>

            <Button
              variant="outline"
              onClick={handleExport}
              className="border-teal-600 text-teal-600 hover:bg-teal-50"
            >
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>

            <Button
              variant="outline"
              onClick={handleLogout}
              className="border-red-600 text-red-600 hover:bg-red-50"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading movies...</p>
          </div>
        ) : movies.length > 0 ? (
          <div className="grid gap-4">
            {movies.map((movie) => (
              <Card key={movie.id} className="p-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-gray-900">
                      {movie.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {movie.year} • {movie.director} • {movie.genre.join(", ")}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className="border-teal-600 text-teal-600 hover:bg-teal-50"
                    >
                      <Link href={`/admin/movies/${movie.id}`}>
                        <Edit2 className="w-4 h-4" />
                      </Link>
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setDeleteId(movie.id)}
                      className="border-red-600 text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center">
            <p className="text-gray-600 text-lg mb-4">No movies found</p>
            <Button asChild className="bg-teal-600 hover:bg-teal-700">
              <Link href="/admin/movies/new">
                <Plus className="w-4 h-4 mr-2" />
                Add First Movie
              </Link>
            </Button>
          </Card>
        )}

        <AlertDialog
          open={deleteId !== null}
          onOpenChange={(open) => !open && setDeleteId(null)}
        >
          <AlertDialogContent>
            <AlertDialogTitle>Delete Movie?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this movie? This action cannot be
              undone.
            </AlertDialogDescription>
            <div className="flex gap-2 justify-end">
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                className="bg-red-600 hover:bg-red-700"
              >
                Delete
              </AlertDialogAction>
            </div>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </main>
  );
}
