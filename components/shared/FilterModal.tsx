"use client";

import React, { ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Filter, X } from "lucide-react";

interface FilterModalProps {
  /** Dialog title */
  title?: string;
  /** Dialog description */
  description?: string;
  /** Number of active filters to show in badge */
  activeFiltersCount?: number;
  /** Whether any filters are active */
  hasActiveFilters?: boolean;
  /** Callback when clear filters is clicked */
  onClearFilters?: () => void;
  /** Filter content to render inside the modal */
  children: ReactNode;
  /** Custom trigger button (optional) */
  trigger?: ReactNode;
  /** Control dialog open state externally (optional) */
  open?: boolean;
  /** Callback when dialog open state changes */
  onOpenChange?: (open: boolean) => void;
}

const FilterModal = ({
  title = "Filter",
  description = "Apply filters to refine your results",
  activeFiltersCount = 0,
  hasActiveFilters = false,
  onClearFilters,
  children,
  trigger,
  open: controlledOpen,
  onOpenChange,
}: FilterModalProps) => {
  const [internalOpen, setInternalOpen] = React.useState(false);

  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const setOpen = isControlled ? onOpenChange || (() => {}) : setInternalOpen;

  const defaultTrigger = (
    <Button variant="outline" size="icon" className="relative">
      <Filter className="h-4 w-4" />
      {hasActiveFilters && activeFiltersCount > 0 && (
        <Badge
          variant="destructive"
          className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
          {activeFiltersCount}
        </Badge>
      )}
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger || defaultTrigger}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          {children}

          {hasActiveFilters && onClearFilters && (
            <Button
              variant="outline"
              onClick={() => {
                onClearFilters();
                setOpen(false);
              }}
              className="w-full">
              <X className="h-4 w-4 mr-2" />
              Clear Filters
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FilterModal;
