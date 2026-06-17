import React, {
  createContext,
  useContext,
  useState,
  useEffect
} from "react";

const PreferencesContext = createContext(null);

export function PreferencesProvider({ children }) {
  const [selectedPreferences, setSelectedPreferences] = useState([]);
  const [customPreferences, setCustomPreferencesState] = useState([]);

  useEffect(() => {
    const user = JSON.parse(
      localStorage.getItem("user")
    );

    if (user?.dietPreferences) {

      setSelectedPreferences(
        user.dietPreferences.selectedPreferences || []
      );

      setCustomPreferencesState(
        user.dietPreferences.customPreferences || []
      );

    } else {

      setSelectedPreferences([]);
      setCustomPreferencesState([]);

    }
  }, []);

  const setPreferences = (preferences) => {
    setSelectedPreferences(preferences);
    localStorage.setItem(
      "selectedPreferences",
      JSON.stringify(preferences)
    );
  };

  const setCustomPreferences = (preferences) => {
    setCustomPreferencesState(preferences);

    localStorage.setItem(
      "customPreferences",
      JSON.stringify(preferences)
    );
  };

  const togglePreference = (id) => {
    setSelectedPreferences((prev) => {

      let newPreferences;

      if (id === "no-preference") {

        if (prev.includes("no-preference")) {
          newPreferences = prev.filter((p) => p !== "no-preference");
        } else {
          newPreferences = ["no-preference"];
        }

      } else {

        const withoutNoPreference =
          prev.filter((p) => p !== "no-preference");

        if (withoutNoPreference.includes(id)) {
          newPreferences =
            withoutNoPreference.filter((p) => p !== id);
        } else {
          newPreferences =
            [...withoutNoPreference, id];
        }
      }

      localStorage.setItem(
        "selectedPreferences",
        JSON.stringify(newPreferences)
      );

      return newPreferences;
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