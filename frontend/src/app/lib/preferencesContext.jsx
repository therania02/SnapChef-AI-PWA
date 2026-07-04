import React, {
  createContext,
  useContext,
  useState,
  useEffect
} from "react";
import { useUser } from "./userContext.jsx";
import { API_BASE_URL } from "../../api/config";

const PreferencesContext = createContext(null);

export function PreferencesProvider({ children }) {
  const { user } = useUser();
  const [selectedPreferences, setSelectedPreferences] = useState([]);
  const [customPreferences, setCustomPreferencesState] = useState([]);

  useEffect(() => {
    const userFromStorage = JSON.parse(localStorage.getItem("user"));
    const sourceUser = user || userFromStorage;

    if (sourceUser?.dietPreferences) {
      setSelectedPreferences(
        sourceUser.dietPreferences.selectedPreferences || []
      );

      setCustomPreferencesState(
        sourceUser.dietPreferences.customPreferences || []
      );
    } else {
      setSelectedPreferences([]);
      setCustomPreferencesState([]);
    }
  }, [user]);

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

  // ✅ dipisahkan dari state handler (FIX UTAMA)
  const savePreferencesToDB = async (selected, custom) => {
    try {
      const token = localStorage.getItem("token");

      await fetch(`${API_BASE_URL}/api/auth/diet-preferences`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          selectedPreferences: selected,
          customPreferences: custom
        })
      });
    } catch (error) {
      console.error("Failed to save preferences:", error);
    }
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
          newPreferences = [...withoutNoPreference, id];
        }
      }

      // simpan ke localStorage (tetap sama behavior UI)
      localStorage.setItem(
        "selectedPreferences",
        JSON.stringify(newPreferences)
      );

      // 🔥 FIX: pakai value terbaru customPreferences (bukan stale)
      savePreferencesToDB(newPreferences, customPreferences);

      return newPreferences;
    });
  };

  return (
    <PreferencesContext.Provider
      value={{
        selectedPreferences,
        customPreferences,
        setPreferences,
        setCustomPreferences,
        togglePreference
      }}
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