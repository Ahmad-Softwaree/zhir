import React from "react";
import { Loader2 } from "lucide-react";

const Cards = () => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="h-48 bg-muted rounded-lg animate-pulse" />
      ))}
    </div>
  );
};

const Spinner = () => {
  return (
    <div className="flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
    </div>
  );
};

const PageLoading = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="text-lg text-muted-foreground animate-pulse">
          Loading...
        </p>
      </div>
    </div>
  );
};

const Loading = () => null;

//Loading.Card
Loading.Cards = Cards;
Loading.Spinner = Spinner;
Loading.PageLoading = PageLoading;

export default Loading;
