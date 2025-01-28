import { createContext } from 'react';

interface ViewModeContextType {
  viewMode: "admin" | "dealer" | "user";
  setViewMode: (mode: "admin" | "dealer" | "user") => void;
}

export const ViewModeContext = createContext<ViewModeContextType | undefined>(undefined);
