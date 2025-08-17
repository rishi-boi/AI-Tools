import { LoaderCircle } from "lucide-react";
import React from "react";

const Loader = () => {
  return (
    <div className="absolute w-full h-screen flex items-center justify-center top-0 left-0 bg-background">
      <span className="flex gap-2 text-lg justify-center items-center">
        Loading <LoaderCircle className="animate-spin" />
      </span>
    </div>
  );
};

export default Loader;
