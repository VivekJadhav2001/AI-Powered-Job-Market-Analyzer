import { createContext, useMemo, useState } from "react";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const value = useMemo(
    () => ({ isSidebarOpen, setSidebarOpen, uploadedFile, setUploadedFile }),
    [isSidebarOpen, uploadedFile],
  );
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export { AppContext };
