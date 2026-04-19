import { createBrowserRouter } from "react-router-dom";
import Root from "./app/components/Root";
import OnboardingScreen from "./app/components/pages/Onboarding";
import LoginScreen from "./app/components/pages/Login";
import RegisterScreen from "./app/components/pages/Register";
import DietaryProfileScreen from "./app/components/pages/DietaryProfile";
import HomeScreen from "./app/components/pages/Home";
import ScanResultScreen from "./app/components/pages/ScanResult";
import RecipeDetailScreen from "./app/components/pages/RecipeDetail";
import CookingModeScreen from "./app/components/pages/CookingMode";
import CookbookScreen from "./app/components/pages/Cookbook";
import ShoppingListScreen from "./app/components/pages/ShoppingList";
import MessageScreen from "./app/components/pages/Message";
import ChatDetailScreen from "./app/components/pages/ChatDetail";
import AccountScreen from "./app/components/pages/Account";
import PremiumScreen from "./app/components/pages/Premium";
import SettingsScreen from "./app/components/pages/Settings";
import ScanHistoryScreen from "./app/components/pages/ScanHistory";
import HelpCenterScreen from "./app/components/pages/HelpCenter";
import TermsScreen from "./app/components/pages/Terms";
import PrivacyScreen from "./app/components/pages/Privacy";
import NotFoundScreen from "./app/components/pages/NotFound";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: OnboardingScreen },
      { path: "login", Component: LoginScreen },
      { path: "register", Component: RegisterScreen },
      { path: "dietary-profile", Component: DietaryProfileScreen },
      { path: "home", Component: HomeScreen },
      { path: "scan-result", Component: ScanResultScreen },
      { path: "recipe/:id", Component: RecipeDetailScreen },
      { path: "cooking/:id", Component: CookingModeScreen },
      { path: "cookbook", Component: CookbookScreen },
      { path: "shopping-list", Component: ShoppingListScreen },
      { path: "account", Component: AccountScreen },
      { path: "settings", Component: SettingsScreen },
      { path: "scan-history", Component: ScanHistoryScreen },
      { path: "help-center", Component: HelpCenterScreen },
      { path: "terms", Component: TermsScreen },
      { path: "privacy", Component: PrivacyScreen },
      { path: "premium", Component: PremiumScreen },
      { path: "messages", Component: MessageScreen },
      { path: "messages/:chatId", Component: ChatDetailScreen },
      { path: "*", Component: NotFoundScreen },
    ],
  },
]);