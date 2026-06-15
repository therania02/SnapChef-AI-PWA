import { createBrowserRouter } from "react-router-dom";
import Root from "./app/components/root";
import OnboardingScreen from "./app/components/pages/onboarding";
import LoginScreen from "./app/components/pages/login";
import RegisterScreen from "./app/components/pages/register";
import DietaryProfileScreen from "./app/components/pages/dietaryProfile";
import HomeScreen from "./app/components/pages/home";
import ScanResultScreen from "./app/components/pages/scanResult";
import RecipeDetailScreen from "./app/components/pages/recipeDetail";
import CookingModeScreen from "./app/components/pages/cookingMode";
import CookbookScreen from "./app/components/pages/cookbook";
import ShoppingListScreen from "./app/components/pages/shoppingList";
import MessageScreen from "./app/components/pages/message";
import ChatDetailScreen from "./app/components/pages/chatDetail";
import AccountScreen from "./app/components/pages/account";
import PremiumScreen from "./app/components/pages/premium";
import PaymentSuccessScreen from "./app/components/pages/paymentSuccess";
import SettingsScreen from "./app/components/pages/settings";
import ScanHistoryScreen from "./app/components/pages/scanHistory";
import HelpCenterScreen from "./app/components/pages/helpCenter";
import TermsScreen from "./app/components/pages/terms";
import PrivacyScreen from "./app/components/pages/privacy";
import NotFoundScreen from "./app/components/pages/notFound";

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
      { path: "payment-success", Component: PaymentSuccessScreen },
      { path: "messages", Component: MessageScreen },
      { path: "messages/:chatId", Component: ChatDetailScreen },
      { path: "*", Component: NotFoundScreen },
    ],
  },
]);
