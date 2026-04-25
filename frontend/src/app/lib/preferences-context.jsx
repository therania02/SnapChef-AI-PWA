import React, { createContext, useContext, useState } from "react";



const PreferencesContext = createContext(null);

export function PreferencesProvider({ children }) {
  const [selectedPreferences, setSelectedPreferences] = useState(["halal"]);
  const [customPreferences, setCustomPreferencesState] = useState([]);

  const setPreferences = (preferences) => {
    setSelectedPreferences(preferences);
  };

  const setCustomPreferences = (preferences) => {
    setCustomPreferencesState(preferences);
  };

  const togglePreference = (id) => {
    setSelectedPreferences((prev) => {
      // If clicking "no-preference"
      if (id === "no-preference") {
        // If already selected, unselect it
        if (prev.includes("no-preference")) {
          return prev.filter((p) => p !== "no-preference");
        }
        // Otherwise, select only "no-preference" and clear all others
        return ["no-preference"];
      }
      
      // If clicking any other preference
      // Remove "no-preference" if it exists, then toggle the clicked preference
      const withoutNoPreference = prev.filter((p) => p !== "no-preference");
      
      if (withoutNoPreference.includes(id)) {
        return withoutNoPreference.filter((p) => p !== id);
      } else {
        return [...withoutNoPreference, id];
      }
    });
  };

  return (
    <PreferencesContext.Provider
      value={{ selectedPreferences, customPreferences, setPreferences, setCustomPreferences, togglePreference }}
    >
      {children}
    </PreferencesContext.Provider>
  );
}

export function usePreferences() {
  const context = useContext(PreferencesContext);
  if (!context) {
    throw new Error("usePreferences must be used within a PreferencesProvider");
  }
  return context;
}