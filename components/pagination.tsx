"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  limit: number;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
}

export function Pagination({
  currentPage,
  totalPages,
  limit,
  onPageChange,
  onLimitChange,
}: PaginationProps) {
  const [jumpPage, setJumpPage] = useState<string>("");

  const handleJump = () => {
    const page = parseInt(jumpPage, 10);
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
      setJumpPage("");
    }
  };

  return (
    <div className="bg-gray-900 rounded-lg p-6 space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-400">Items per page:</span>
          <Select
            value={limit.toString()}
            onValueChange={(val) => {
              onLimitChange(parseInt(val, 10));
              onPageChange(1);
            }}
          >
            <SelectTrigger className="w-20 text-gray-300 border-gray-600">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="bg-white border-gray-800 text-gray-700 hover:bg-gray-200 disabled:opacity-50"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>

          <div className="flex items-center gap-2 px-2">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum: number;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }
              return (
                <Button
                  key={pageNum}
                  variant={currentPage === pageNum ? "default" : "ghost"}
                  size="sm"
                  onClick={() => onPageChange(pageNum)}
                  className={
                    currentPage === pageNum
                      ? "bg-white text-gray-700 hover:bg-gray-200"
                      : "hover:bg-teal-50 text-gray-600"
                  }
                >
                  {pageNum}
                </Button>
              );
            })}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="bg-white border-gray-800 text-gray-700 hover:bg-gray-200 disabled:opacity-50"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="flex gap-2 items-center justify-center md:justify-start">
        <Input
          type="number"
          min="1"
          max={totalPages}
          placeholder="Jump to page"
          value={jumpPage}
          onChange={(e) => setJumpPage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleJump()}
          className="w-32 border-gray-600 text-gray-200"
        />
        <Button
          onClick={handleJump}
          className="bg-white hover:bg-gray-200 text-black"
        >
          Go
        </Button>
      </div>

      <div className="text-sm text-gray-400 text-center">
        Page {currentPage} of {totalPages}
      </div>
    </div>
  );
}
