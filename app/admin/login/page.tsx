"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { login } from "@/lib/client";
import { toast } from "sonner";
import { ArrowLeft, Lock } from "lucide-react";
import Link from "next/link";

export default function AdminLogin() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!password) {
      setError("Password is required");
      return;
    }

    try {
      setLoading(true);
      await login(password);
      toast.success("Login successful");
      router.push("/admin");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Login failed. Please try again.";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-black flex items-center flex-col justify-center px-4">
      <Link
        href="/"
        className="self-start max-w-md mx-auto flex w-full justify-start"
      >
        <Button variant="ghost" className="mb-4 text-gray-200">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Movies
        </Button>
      </Link>
      <Card className="w-full max-w-md">
        <div className="p-8">
          <div className="flex justify-center mb-6">
            <div className="bg-gray-200 rounded-lg p-3">
              <Lock className="w-8 h-8 text-black" />
            </div>
          </div>

          <h1 className="text-2xl font-bold text-center text-gray-100 mb-2">
            Admin Login
          </h1>
          <p className="text-center text-gray-300 mb-8">
            Enter your password to access the admin panel
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label
                htmlFor="password"
                className="text-sm font-medium text-gray-300 mb-2 block"
              >
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                disabled={loading}
                className={`${error ? "border-red-500" : ""} text-gray-200`}
                autoFocus
              />
              {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-white hover:bg-gray-200 text-black font-medium py-2"
            >
              {loading ? "Logging in..." : "Login"}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t">
            <p className="text-xs text-gray-400 text-center">
              This is a secure area. Only authorized personnel should access
              this page.
            </p>
          </div>
        </div>
      </Card>
    </main>
  );
}
