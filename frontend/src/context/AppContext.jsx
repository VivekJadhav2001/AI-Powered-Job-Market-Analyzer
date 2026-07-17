import { createContext, useMemo, useState } from "react";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [profile, setProfile] = useState({
    name: "Arjun Kumar",
    email: "arjun.kumar@example.com",
    phone: "",
    location: "",
    headline: "",
    linkedin: "",
    skills: ["Python", "Data Analysis", "SQL"],
    resume: null,
  });
  const value = useMemo(
    () => ({ isSidebarOpen, setSidebarOpen, uploadedFile, setUploadedFile, profile, setProfile }),
    [isSidebarOpen, uploadedFile, profile],
  );
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export { AppContext };
