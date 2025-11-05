"use client";

import { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Search, X } from "lucide-react";

interface MovieFiltersProps {
  genres: string[];
  yearRange: [number, number];
  onFilter: (filters: FilterState) => void;
  currentFilters: FilterState;
}

export interface FilterState {
  genre: string;
  yearMin: number;
  yearMax: number;
  search: string;
}

export function MovieFilters({
  genres,
  yearRange,
  onFilter,
  currentFilters,
}: MovieFiltersProps) {
  const [localFilters, setLocalFilters] = useState<FilterState>(currentFilters);
  const [years, setYears] = useState<[number, number]>([
    currentFilters.yearMin,
    currentFilters.yearMax,
  ]);

  const handleGenreChange = useCallback(
    (value: string) => {
      const newFilters = { ...localFilters, genre: value };
      setLocalFilters(newFilters);
      onFilter(newFilters);
    },
    [localFilters, onFilter]
  );

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newFilters = { ...localFilters, search: e.target.value };
      setLocalFilters(newFilters);
    },
    [localFilters]
  );

  const handleSearchSubmit = useCallback(() => {
    onFilter(localFilters);
  }, [localFilters, onFilter]);

  const handleYearChange = useCallback(
    (value: [number, number]) => {
      setYears(value);
      const newFilters = {
        ...localFilters,
        yearMin: value[0],
        yearMax: value[1],
      };
      setLocalFilters(newFilters);
      onFilter(newFilters);
    },
    [localFilters, onFilter]
  );

  const handleClearFilters = useCallback(() => {
    const clearedFilters: FilterState = {
      genre: "all",
      yearMin: yearRange[0],
      yearMax: yearRange[1],
      search: "",
    };
    setLocalFilters(clearedFilters);
    setYears([yearRange[0], yearRange[1]]);
    onFilter(clearedFilters);
  }, [onFilter, yearRange]);

  const hasActiveFilters =
    localFilters.genre !== "all" ||
    localFilters.search ||
    localFilters.yearMin !== yearRange[0] ||
    localFilters.yearMax !== yearRange[1];

  return (
    <div className="bg-gray-900 rounded-lg shadow-md p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearFilters}
            className="text-gray-300 hover:bg-gray-800 hover:text-gray-200"
          >
            <X className="w-4 h-4 mr-1" />
            Clear All
          </Button>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="search" className="text-sm font-medium text-gray-400">
          Search
        </Label>
        <div className="flex gap-2 ">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              id="search"
              placeholder="Search movies, directors..."
              value={localFilters.search}
              onChange={handleSearchChange}
              className="pl-10 border-gray-500 text-gray-300"
              onKeyDown={(e) => e.key === "Enter" && handleSearchSubmit()}
            />
          </div>
          <Button
            onClick={handleSearchSubmit}
            className="bg-white text-gray-900 hover:bg-gray-200"
          >
            Search
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="genre" className="text-sm font-medium text-gray-400">
          Genre
        </Label>
        <Select value={localFilters.genre} onValueChange={handleGenreChange}>
          <SelectTrigger id="genre" className="border-gray-500 text-gray-400">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="">
            <SelectItem value="all">All Genres</SelectItem>
            {genres.map((genre) => (
              <SelectItem key={genre} value={genre}>
                {genre}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="year" className="text-sm font-medium text-gray-400">
          Year Range: {years[0]} - {years[1]}
        </Label>
        <Slider
          id="year"
          min={yearRange[0]}
          max={yearRange[1]}
          step={1}
          value={years}
          onValueChange={handleYearChange}
          className="w-full"
        />
      </div>
    </div>
  );
}
