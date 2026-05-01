import { Outlet } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { Toaster } from "../../ui/sonner";
import { UserProvider } from "../lib/user-context";
import { PreferencesProvider } from "../lib/preferences-context";
import { LanguageProvider } from "../lib/language-context";
import { CookingPostsProvider } from "../lib/cookingPostContext";
import { FavoritesProvider } from "../lib/favorites-context";

export default function Root() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <UserProvider>
        <PreferencesProvider>
          <LanguageProvider>
            <CookingPostsProvider>
              <FavoritesProvider>
                {/* Mobile & Tablet: Centered container */}
                {/* Laptop & Desktop: Full screen */}
                <div className="mx-auto w-full sm:max-w-md lg:max-w-full min-h-screen bg-background sm:shadow-2xl lg:shadow-none relative">
                  <Outlet />
                </div>

                <Toaster />
              </FavoritesProvider>
            </CookingPostsProvider>
          </LanguageProvider>
        </PreferencesProvider>
      </UserProvider>
    </ThemeProvider>
  );
}