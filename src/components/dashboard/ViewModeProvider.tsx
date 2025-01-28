import React, { useState } from 'react';
import { ViewModeContext } from './ViewModeContext';

interface ViewModeProviderProps {
  children: React.ReactNode;
}

export function ViewModeProvider({ children }: ViewModeProviderProps) {
  const [viewMode, setViewMode] = useState<"admin" | "dealer" | "user">("user");

  return (
    <ViewModeContext.Provider value={{ viewMode, setViewMode }}>
      {children}
    </ViewModeContext.Provider>
  );
}