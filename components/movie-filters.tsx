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
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "./ui/field";

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
    [localFilters, onFilter],
  );

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newFilters = { ...localFilters, search: e.target.value };
      setLocalFilters(newFilters);
    },
    [localFilters],
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
    [localFilters, onFilter],
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
    <Card>
      <CardHeader>
        <CardTitle>Filters</CardTitle>
        <CardAction>
          {hasActiveFilters && (
            <Button
              variant="destructive"
              size="xs"
              onClick={handleClearFilters}
            >
              <X />
              Clear All
            </Button>
          )}
        </CardAction>
      </CardHeader>

      <CardContent>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="search">Search</FieldLabel>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search movies, directors..."
                  value={localFilters.search}
                  onChange={handleSearchChange}
                  className="pl-10 border-input text-foreground"
                  onKeyDown={(e) => e.key === "Enter" && handleSearchSubmit()}
                />
              </div>
              <Button onClick={handleSearchSubmit}>Search</Button>
            </div>
          </Field>

          <Field>
            <FieldLabel htmlFor="genre">Genre</FieldLabel>
            <Select
              value={localFilters.genre}
              onValueChange={handleGenreChange}
            >
              <SelectTrigger id="genre" className="w-full">
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
          </Field>

          <Field>
            <FieldLabel htmlFor="year">
              Year Range: {years[0]} - {years[1]}
            </FieldLabel>
            <Slider
              id="year"
              min={yearRange[0]}
              max={yearRange[1]}
              step={1}
              value={years}
              onValueChange={handleYearChange}
              className="w-full"
            />
          </Field>
        </FieldGroup>
      </CardContent>
    </Card>
  );
}
