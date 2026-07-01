import { createBrowserRouter } from "react-router-dom";
import Root from "./app/components/root";
import { ProtectedRoute } from "./app/components/ProtectedRoute.jsx";
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
      {
        path: "dietary-profile",
        Component: () => (
          <ProtectedRoute>
            <DietaryProfileScreen />
          </ProtectedRoute>
        ),
      },
      {
        path: "home",
        Component: () => (
          <ProtectedRoute>
            <HomeScreen />
          </ProtectedRoute>
        ),
      },
      {
        path: "scan-result",
        Component: () => (
          <ProtectedRoute>
            <ScanResultScreen />
          </ProtectedRoute>
        ),
      },
      {
        path: "recipe/:id",
        Component: () => (
          <ProtectedRoute>
            <RecipeDetailScreen />
          </ProtectedRoute>
        ),
      },
      {
        path: "cooking/:id",
        Component: () => (
          <ProtectedRoute>
            <CookingModeScreen />
          </ProtectedRoute>
        ),
      },
      {
        path: "cookbook",
        Component: () => (
          <ProtectedRoute>
            <CookbookScreen />
          </ProtectedRoute>
        ),
      },
      {
        path: "shopping-list",
        Component: () => (
          <ProtectedRoute>
            <ShoppingListScreen />
          </ProtectedRoute>
        ),
      },
      {
        path: "account",
        Component: () => (
          <ProtectedRoute>
            <AccountScreen />
          </ProtectedRoute>
        ),
      },
      {
        path: "settings",
        Component: () => (
          <ProtectedRoute>
            <SettingsScreen />
          </ProtectedRoute>
        ),
      },
      {
        path: "scan-history",
        Component: () => (
          <ProtectedRoute>
            <ScanHistoryScreen />
          </ProtectedRoute>
        ),
      },
      {
        path: "help-center",
        Component: () => (
          <ProtectedRoute>
            <HelpCenterScreen />
          </ProtectedRoute>
        ),
      },
      { path: "terms", Component: TermsScreen },
      { path: "privacy", Component: PrivacyScreen },
      {
        path: "premium",
        Component: () => (
          <ProtectedRoute>
            <PremiumScreen />
          </ProtectedRoute>
        ),
      },
      {
        path: "payment-success",
        Component: () => (
          <ProtectedRoute>
            <PaymentSuccessScreen />
          </ProtectedRoute>
        ),
      },
      {
        path: "messages",
        Component: () => (
          <ProtectedRoute>
            <MessageScreen />
          </ProtectedRoute>
        ),
      },
      {
        path: "messages/:chatId",
        Component: () => (
          <ProtectedRoute>
            <ChatDetailScreen />
          </ProtectedRoute>
        ),
      },
      { path: "*", Component: NotFoundScreen },
    ],
  },
]);
