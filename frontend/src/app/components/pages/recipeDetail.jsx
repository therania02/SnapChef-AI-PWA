import { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  ArrowLeft, Heart, Share2, Plus, Minus, AlertCircle, Flame, MessageCircle, Star, ArrowRight, X, Crown, Lock, Send
} from "lucide-react";
import { Button } from "../../../ui/button.jsx";
import { Badge } from "../../../ui/badge.jsx";
import { toast } from "sonner";
import { mockRecipes } from "../../lib/data.js";
import { useFavorites } from "../../lib/favoritesContext.jsx";
import { useUser } from "../../lib/userContext.jsx";
import { IngredientSubstituteDropdown } from "../../../ui/ingredientSubstituteDropdown.jsx";
import { useRecipes } from "../../../hooks/useRecipes.js"; // Pastikan ini di-import
import {
  tweakRecipeWithAI
}
  from "../../lib/geminiVision";
import { useLanguage } from "../../lib/languageContext.jsx";

// --- FUNGSI PARSER CERDAS UNTUK BAHAN ---
const parseIngredientLine = (line) => {
  let cleanLine = line.replace(/^[-*•]\s*/, '').trim();

  if (cleanLine.toLowerCase().includes('secukupnya')) {
    return {
      name: cleanLine.replace(/secukupnya/i, '').replace(/,/g, '').trim() || cleanLine,
      amount: null,
      unit: 'secukupnya',
      available: true,
      nameEn: null
    };
  }

  const match = cleanLine.match(/^(?:(\d+(?:[.,]\d+)?(?:\/\d+)?)\s*)(?:(cups?|cup|cangkir|cups?|grams?|gram|g|gr|kg|kg|milliliters?|ml|l|liters?|liter|tablespoons?|tablespoon|tbsp|sendok makan|sendok teh|sendok|sdm|sdt|teaspoon|teaspoons|tsp|siung|buah|bh|biji|ikat|lembar|lbr|piring|bungkus|bks|batang|potong|ruas|butir|kaleng|sachet|tetes|genggam|jumput|pcs|oz|ounce|ounces|lb|pounds?|as needed|to taste|secukupnya)\s+)?(.*)$/i);

  if (match) {
    let numStr = match[1];
    let amount = null;

    if (numStr) {
      if (numStr.includes('/')) {
        const [num, den] = numStr.split('/');
        amount = parseFloat(num) / parseFloat(den);
      } else {
        amount = parseFloat(numStr.replace(',', '.'));
      }
    }

    let extractedUnit = match[2] ? match[2].toLowerCase() : null;
    if (!extractedUnit && numStr) extractedUnit = 'buah';

    if (extractedUnit === 'g' || extractedUnit === 'gr' || extractedUnit === 'grams') extractedUnit = 'gram';
    if (extractedUnit === 'bh' || extractedUnit === 'pcs') extractedUnit = 'buah';
    if (extractedUnit === 'bks') extractedUnit = 'bungkus';
    if (extractedUnit === 'lbr') extractedUnit = 'lembar';
    if (extractedUnit === 'cup') extractedUnit = 'cups';
    if (extractedUnit === 'cups') extractedUnit = 'cups';
    if (extractedUnit === 'kilogram' || extractedUnit === 'kilograms') extractedUnit = 'kilogram';
    if (extractedUnit === 'milliliter' || extractedUnit === 'milliliters') extractedUnit = 'ml';
    if (extractedUnit === 'liter' || extractedUnit === 'liters') extractedUnit = 'liter';
    if (extractedUnit === 'tbsp') extractedUnit = 'tablespoon';
    if (extractedUnit === 'tsp') extractedUnit = 'teaspoon';
    if (extractedUnit === 'sdm') extractedUnit = 'tablespoon';
    if (extractedUnit === 'sdt') extractedUnit = 'teaspoon';
    if (extractedUnit === 'sendok') extractedUnit = 'sendok';
    if (extractedUnit === 'ounce' || extractedUnit === 'ounces' || extractedUnit === 'oz') extractedUnit = 'oz';
    if (extractedUnit === 'lb' || extractedUnit === 'pound' || extractedUnit === 'pounds') extractedUnit = 'lb';
    if (extractedUnit === 'as needed' || extractedUnit === 'to taste') extractedUnit = 'to taste';
    if (extractedUnit === 'secukupnya') extractedUnit = 'secukupnya';

    return {
      name: match[3].trim(),
      amount: (numStr ? (isNaN(amount) ? 1 : amount) : 1),
      unit: extractedUnit,
      available: true,
      nameEn: null
    };
  }

  return {
    name: cleanLine,
    amount: null,
    unit: '',
    available: true,
    nameEn: null
  };
};

const parseIngredientList = (source) => {
  const lines = Array.isArray(source)
    ? source
    : String(source || "").split("\n").filter((line) => line.trim() !== "");

  return lines.map((item) =>
    typeof item === "string" ? parseIngredientLine(item) : item
  );
};

const mergeBilingualIngredients = (idIngredients, enIngredients, language) => {
  const normalizeKey = (item) => normalizeIngredientName(item?.name || '');

  const enIndexByNormalized = new Map();
  enIngredients.forEach((item, index) => {
    const normalized = normalizeKey(item);
    if (normalized) enIndexByNormalized.set(normalized, index);
  });

  const usedEnIndexes = new Set();
  const mergedItems = [];

  const makeMergedItem = (idItem, enItem) => {
    const baseItem = language === 'en' ? (enItem || idItem) : (idItem || enItem);

    return {
      ...baseItem,
      name: language === 'en'
        ? (enItem?.name || idItem?.name || baseItem.name)
        : (idItem?.name || enItem?.name || baseItem.name),
      nameId: idItem?.name || enItem?.name || '',
      nameEn: enItem?.name || idItem?.name || '',
      rawNameId: idItem?.name || '',
      rawNameEn: enItem?.name || ''
    };
  };

  idIngredients.forEach((idItem, index) => {
    const normalizedId = normalizeKey(idItem);
    let enItem = null;

    if (normalizedId && enIndexByNormalized.has(normalizedId)) {
      const matchedIndex = enIndexByNormalized.get(normalizedId);
      if (!usedEnIndexes.has(matchedIndex)) {
        enItem = enIngredients[matchedIndex];
        usedEnIndexes.add(matchedIndex);
      }
    }

    if (!enItem && enIngredients[index] && !usedEnIndexes.has(index)) {
      enItem = enIngredients[index];
      usedEnIndexes.add(index);
    }

    mergedItems.push(makeMergedItem(idItem, enItem));
  });

  enIngredients.forEach((enItem, index) => {
    if (!usedEnIndexes.has(index)) {
      mergedItems.push(makeMergedItem(null, enItem));
    }
  });

  return mergedItems;
};

const unitLabels = {
  id: {
    cups: 'cangkir',
    cup: 'cangkir',
    tablespoon: 'sendok makan',
    tablespoons: 'sendok makan',
    teaspoon: 'sendok teh',
    teaspoons: 'sendok teh',
    gram: 'gram',
    kilograms: 'kilogram',
    kilogram: 'kilogram',
    liter: 'liter',
    liters: 'liter',
    ml: 'ml',
    l: 'l',
    siung: 'siung',
    buah: 'buah',
    butir: 'butir',
    bungkus: 'bungkus',
    batang: 'batang',
    lembar: 'lembar',
    piring: 'piring',
    sendok: 'sendok',
    cangkir: 'cangkir',
    'sendok makan': 'sendok makan',
    'sendok teh': 'sendok teh',
    'secukupnya': 'secukupnya',
    'to taste': 'secukupnya'
  },
  en: {
    cups: 'cups',
    cup: 'cups',
    tablespoon: 'tablespoon',
    tablespoons: 'tablespoons',
    teaspoon: 'teaspoon',
    teaspoons: 'teaspoons',
    gram: 'gram',
    kilograms: 'kilogram',
    kilogram: 'kilogram',
    liter: 'liter',
    liters: 'liter',
    ml: 'ml',
    l: 'l',
    siung: 'clove',
    buah: 'piece',
    butir: 'piece',
    bungkus: 'pack',
    batang: 'stem',
    lembar: 'sheet',
    piring: 'plate',
    sendok: 'spoon',
    cangkir: 'cup',
    'sendok makan': 'tablespoon',
    'sendok teh': 'teaspoon',
    'secukupnya': 'to taste',
    'to taste': 'to taste'
  }
};

const localizeUnit = (unit, language) => {
    if (!unit) return '';
    const normalized = String(unit).toLowerCase();
    return unitLabels[language]?.[normalized] || unitLabels.id?.[normalized] || unit;
};

const normalizeIngredientName = (name) => {
  return String(name)
    .toLowerCase()
    .replace(/\b(cups?|cup|tablespoons?|tablespoon|tbsp|sendok makan|sendok teh|teaspoon|teaspoons|tsp|grams?|gram|g|gr|kg|kilograms?|kilogram|liter|liters?|liter|ml|l|milliliters?|milliliter|siung|buah|bh|biji|ikat|lembar|lbr|piring|bungkus|bks|batang|potong|ruas|butir|kaleng|sachet|tetes|genggam|jumput|pcs|oz|ounce|ounces|lb|pound|pounds?|as needed|to taste|secukupnya|sendok)\b/gi, ' ')
    .replace(/[\d.,\/]+/g, ' ')
    .replace(/[^a-z0-9\s]/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
};

const ingredientTranslationMap = {
  selada: ['lettuce'],
  tomat: ['tomato', 'tomatoes'],
  'tomat cherry': ['cherry tomatoes'],
  'bawang putih': ['garlic'],
  'bawang merah': ['shallot', 'shallots'],
  'bawang bombay': ['onion'],
  bawang: ['onion', 'garlic'],
  ayam: ['chicken'],
  'daging ayam': ['chicken meat', 'chicken'],
  wortel: ['carrot', 'carrots'],
  kubis: ['cabbage'],
  garam: ['salt'],
  gula: ['sugar'],
  telur: ['egg', 'eggs'],
  'minyak goreng': ['cooking oil', 'vegetable oil'],
  kacang: ['nuts'],
  keju: ['cheese'],
  saus: ['sauce'],
  rumput: ['grass'],
  serai: ['lemongrass'],
  jahe: ['ginger'],
  kunyit: ['turmeric'],
  mentega: ['butter'],
  susu: ['milk'],
  terigu: ['flour'],
  nasi: ['rice'],
  'kecap manis': ['sweet soy sauce'],
  cabe: ['chili', 'chilli'],
  cabai: ['chili', 'chilli'],
  'daun bawang': ['spring onion', 'scallion'],
  'daun ketumbar': ['cilantro', 'coriander'],
  salmon: ['salmon'],
  pisang: ['banana', 'bananas'],
  madu: ['honey'],
  stroberi: ['strawberries', 'strawberry'],
  raspberry: ['raspberries', 'raspberry'],
  blueberry: ['blueberries', 'blueberry'],
  ceri: ['cherries', 'cherry'],
  apel: ['apel'],
  laya: ['pir'],
  jeruk: ['orange', 'oranges'],
  anggur: ['grapes', 'grape'],
  brokoli: ['broccoli']
};

const expandIngredientTranslations = (name) => {
  if (!name) return [];
  const normalized = normalizeIngredientName(name);
  const variants = [normalized];
  Object.entries(ingredientTranslationMap).forEach(([key, translations]) => {
    if (normalized.includes(key)) {
      translations.forEach((translation) => {
        variants.push(normalizeIngredientName(translation));
      });
    }
  });
  return [...new Set(variants.filter(Boolean))];
};

const tokenizeIngredientWords = (name) => {
  return new Set(
    normalizeIngredientName(name)
      .split(/\s+/)
      .map((word) => {
        const token = word.trim();
        if (!token) return '';
        if (token.endsWith('es') && token.length > 4) return token.slice(0, -2);
        if (token.endsWith('s') && token.length > 3) return token.slice(0, -1);
        return token;
      })
      .filter((word) => word.length > 2)
  );
};

const parseDetectedIngredients = (input) => {
  if (!input) return [];

  if (typeof input === 'string') {
    try {
      const parsed = JSON.parse(input);
      if (Array.isArray(parsed)) return parsed.map((item) => String(item).trim()).filter(Boolean);
      return [String(parsed).trim()].filter(Boolean);
    } catch {
      return String(input)
        .split(/\r?\n|,|;|\t/)
        .map((item) => String(item).trim())
        .filter(Boolean);
    }
  }

  if (Array.isArray(input)) {
    return input.map((item) => String(item).trim()).filter(Boolean);
  }

  if (typeof input === 'object' && input !== null) {
    return Object.values(input)
      .map((item) => String(item).trim())
      .filter(Boolean);
  }

  return [String(input).trim()].filter(Boolean);
};

export default function RecipeDetailScreen() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // 👇 PINDAHKAN KETIGA HOOK INI KE SINI 👇
  const { toggleFavorite, isFavorite } = useFavorites();
  const { user } = useUser();
  const { language, t } = useLanguage();
  console.log(user);
  const { rateRecipe, getSousChefMessages, sendSousChefMessage } = useRecipes();

  const incomingRecipe = location.state?.recipeData;

  const rawSteps =
    incomingRecipe?.instructions ||
    incomingRecipe?.steps ||
    [];

  const parsedSteps = Array.isArray(rawSteps)
    ? rawSteps
    : String(rawSteps)
      .split("\n")
      .filter(s => s.trim() !== "");

  const detectedIngredients = parseDetectedIngredients(
    location.state?.detectedIngredients ||
    incomingRecipe?.detectedIngredients ||
    []
  );

  const localizedTitle = language === "en"
    ? (incomingRecipe?.titleEn || incomingRecipe?.title || incomingRecipe?.titleId)
    : (incomingRecipe?.title || incomingRecipe?.titleEn || incomingRecipe?.titleId);

  const localizedIngredientsRaw = language === "en"
    ? (incomingRecipe?.ingredientsEn || incomingRecipe?.ingredients || incomingRecipe?.ingredientsId)
    : (incomingRecipe?.ingredients || incomingRecipe?.ingredientsEn || incomingRecipe?.ingredientsId);

  const localizedInstructionsRaw = language === "en"
    ? (incomingRecipe?.instructionsEn || incomingRecipe?.instructions || incomingRecipe?.steps || incomingRecipe?.stepsEn)
    : (incomingRecipe?.instructions || incomingRecipe?.instructionsEn || incomingRecipe?.steps || incomingRecipe?.stepsEn);


  const formattedAIRecipe = incomingRecipe ? {
    id: incomingRecipe.id || id,
    title: localizedTitle,
    image: "https://images.unsplash.com/photo-1493770348161-369560ae357d?q=80&w=500",
    type: t("recipe.ai_recommendation"),
    isHalal: true,
    isVegetarian: false,
    calories:
      incomingRecipe.calories ??
      incomingRecipe.nutrition?.calories ??
      0,



    protein:
      incomingRecipe.protein ??
      incomingRecipe.nutrition?.protein ??
      0,

    carbs:
      incomingRecipe.carbs ??
      incomingRecipe.nutrition?.carbs ??
      0,
    prepTime: incomingRecipe.prepTime ?? 0,
    servings: 2,
    ingredients: mergeBilingualIngredients(
      parseIngredientList(incomingRecipe.ingredients || incomingRecipe.ingredientsId || []),
      parseIngredientList(incomingRecipe.ingredientsEn || []),
      language
    ),

    steps: (Array.isArray(localizedInstructionsRaw)
      ? localizedInstructionsRaw
      : String(localizedInstructionsRaw || "")
        .split("\n")
        .filter(s => s.trim() !== "")
    ).map(step => ({
      instruction: String(step)
        .replace(/^\d+[\.\)]\s*/, "")
        .trim(),
      image: null
    })),
  } : null;

  const recipe = formattedAIRecipe || mockRecipes.find((r) => String(r.id) === String(id)) || mockRecipes[0];

  const normalizedDetected =
    detectedIngredients.map((item) =>
      item.toLowerCase().trim()
    );
  console.log(
    "NORMALIZED:",
    normalizedDetected
  );


  if (recipe?.ingredients) {
    recipe.ingredients =
      recipe.ingredients.map((ingredient) => {
        const normalizedIngredientName = normalizeIngredientName(ingredient.name || "");
        const normalizedIngredientId = normalizeIngredientName(ingredient.nameId || "");
        const normalizedIngredientEn = normalizeIngredientName(ingredient.nameEn || "");
        const normalizedRawNameId = normalizeIngredientName(ingredient.rawNameId || "");
        const normalizedRawNameEn = normalizeIngredientName(ingredient.rawNameEn || "");

        const ingredientVariants = [
          normalizedIngredientName,
          normalizedIngredientId,
          normalizedIngredientEn,
          normalizedRawNameId,
          normalizedRawNameEn
        ].filter(Boolean);

        const ingredientExpandedVariants = [...new Set(
          ingredientVariants.flatMap((variant) => [variant, ...expandIngredientTranslations(variant)])
        )];

        const ingredientTokens = ingredientExpandedVariants.reduce((tokens, variant) => {
          tokenizeIngredientWords(variant).forEach((word) => tokens.add(word));
          return tokens;
        }, new Set());

        const available = normalizedDetected.some((detected) => {
          const normalizedDetectedName = normalizeIngredientName(detected);
          const detectedVariants = [...new Set([
            normalizedDetectedName,
            ...expandIngredientTranslations(normalizedDetectedName)
          ])];

          const detectedTokens = detectedVariants.reduce((tokens, variant) => {
            tokenizeIngredientWords(variant).forEach((word) => tokens.add(word));
            return tokens;
          }, new Set());

          const directMatch = ingredientExpandedVariants.some((variant) =>
            detectedVariants.some((detectedVariant) =>
              variant === detectedVariant ||
              variant.includes(detectedVariant) ||
              detectedVariant.includes(variant)
            )
          );

          const sharedWordMatch = [...ingredientTokens].some((word) =>
            detectedTokens.has(word)
          );

          return directMatch || sharedWordMatch;
        });

        const displayName = language === 'en'
          ? (ingredient.nameEn || ingredient.name || ingredient.nameId)
          : (ingredient.nameId || ingredient.name);

        return {
          ...ingredient,
          available,
          displayName,
          nameEn: ingredient.nameEn || (language === 'en' ? ingredient.name : null)
        };
      });
  }

  const displayPrepTime = recipe.prepTime || 30;

  const [servings, setServings] = useState(recipe.servings || 1);
  const [showTweaker, setShowTweaker] = useState(false);
  const [customRequest, setCustomRequest] = useState("");
  const [rating, setRating] = useState(0);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [isRatingSaved, setIsRatingSaved] = useState(false);
  const [showRatingConfirm, setShowRatingConfirm] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [isLoadingChat, setIsLoadingChat] = useState(false);
  const [isSendingChat, setIsSendingChat] = useState(false);
  const [ingredientSubstitutions, setIngredientSubstitutions] = useState({});

  const recipeRef = `${recipe.id || id}-${recipe.title || "recipe"}`;

  const calculateSubstituteAmount = (ratio, originalAmount) => {
    const parts = ratio.split(":");
    if (parts.length !== 2) return originalAmount;
    const [original, substitute] = parts.map(parseFloat);
    const newAmount = (originalAmount * substitute) / original;
    return Math.round(newAmount * 10) / 10;
  };

  const handleRemoveSubstitution = (ingredientName) => {
    setIngredientSubstitutions(prev => {
      const newSubs = { ...prev };
      delete newSubs[ingredientName];
      return newSubs;
    });
    toast.success(t("recipe.removed_substitution", { name: ingredientName }), {
      description: t("recipe.back_original")
    });
  };

  const { scrollY } = useScroll();
  const headerOpacity = useTransform(scrollY, [0, 100], [0, 1]);

  const servingMultiplier = servings / (recipe.servings || 1);
  const isSaved = isFavorite(recipe.id);

  const handleSave = () => {
    toggleFavorite(recipe.id);
    toast.success(isSaved ? t("recipe.removed_cookbook") : t("recipe.saved_cookbook"));
  };

  const handleShare = () => {
    toast.success(t("recipe.share_success"));
  };

  const handleAddToShoppingList = async (ingredient) => {
    try {
      // Try 1: Check localStorage.token (stored separately in login.jsx)
      let token = localStorage.getItem("token");

      // Try 2: Check localStorage.user.token (stored as part of user object)
      if (!token) {
        const currentUser = JSON.parse(
          localStorage.getItem("user") || "{}"
        );
        token = currentUser.token || "";
      }

      if (!token) {
        toast.error(t("recipe.login_first"));
        return;
      }

      const currentUser = JSON.parse(
        localStorage.getItem("user") || "{}"
      );

      const response = await fetch(
        "http://localhost:3000/api/ingredients",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({
            name: ingredient.name,
            nameEn: ingredient.nameEn || ingredient.name,
            amount: ingredient.amount || 1,
            unit: ingredient.unit || "",
            userId: currentUser.id,
            fromRecipe: recipe.title
          })
        }
      );

      const result = await response.json();
      if (response.ok && result.success) {
        toast.success(
          t("recipe.added_cart", { name: ingredient.name })
        );
      } else {
        toast.error(result.message || t("recipe.add_shopping_failed"));
      }

    } catch (error) {
      console.error("Error:", error);
      toast.error(
        t("recipe.add_shopping_failed")
      );
    }
  };

  const handleTweakerClick = () => {
    if (!user?.isPremium) {
      toast.error(t("recipe.tweaker_premium"), {
        duration: 4000,
        action: { label: t("common.upgrade"), onClick: () => navigate("/premium") },
      });
      return;
    }
    setShowTweaker(!showTweaker);
  };

  const handleTweakRequest =
    async (type) => {

      if (!user?.isPremium) {
        toast.error(
          t("recipe.premium_only")
        );
        return;
      }

      let request = "";

      switch (type) {

        case "spicy":
          request =
            "Buat versi lebih pedas";
          break;

        case "less-sugar":
          request =
            "Buat versi rendah gula";
          break;

        case "healthier":
          request =
            "Buat versi lebih sehat";
          break;

        case "no-chili":
          request =
            "Hilangkan semua cabai";
          break;

        case "less-spicy":
          request =
            "Kurangi tingkat pedas";
          break;

        case "custom":
          request =
            customRequest;
          break;
      }

      toast.loading(
        t("recipe.tweaking")
      );

      const result =
        await tweakRecipeWithAI(
          recipe,
          request,
          language
        );

      toast.dismiss();

      if (!result) {
        toast.error(
          t("recipe.tweak_failed")
        );
        return;
      }

      navigate(
        `/recipe/${recipe.id}`,
        {
          state: {
            recipeData: result,
            detectedIngredients
          }
        }
      );
    };

  const handleRating = (star) => {
    if (!isRatingSaved) setRating(star);
  };

  const handleSaveRating = () => setShowRatingConfirm(true);

  const confirmSaveRating = async () => {
    try {
      await rateRecipe(recipe.id, rating);

      setIsRatingSaved(true);
      setShowRatingConfirm(false);
      toast.success(t("recipe.rating_saved_db", { rating }));
    } catch (error) {
      toast.error(t("recipe.rating_save_failed", { message: error.message }));
    }
  };

  const cancelSaveRating = () => setShowRatingConfirm(false);

  useEffect(() => {
    const loadSousChefHistory = async () => {
      if (!showChat) return;

      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        setIsLoadingChat(true);
        const messages = await getSousChefMessages(recipe.id || id, recipeRef);
        setChatMessages(Array.isArray(messages) ? messages : []);
      } catch (error) {
        toast.error(error.message || t("common.error"));
      } finally {
        setIsLoadingChat(false);
      }
    };

    loadSousChefHistory();
  }, [showChat, recipe.id, id, recipeRef, t]);

  const handleChatSubmit = async () => {
    const trimmed = chatInput.trim();
    if (!trimmed || isSendingChat) return;

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error(t("premium.login_required"));
      return;
    }

    try {
      setIsSendingChat(true);
      const payload = await sendSousChefMessage({
        recipeId: recipe.id || id,
        message: trimmed,
        recipeRef,
        recipe,
        language
      });

      setChatInput("");

      if (payload?.userMessage && payload?.aiMessage) {
        setChatMessages((prev) => [...prev, payload.userMessage, payload.aiMessage]);
      }
    } catch (error) {
      toast.error(error.message || t("common.error"));
    } finally {
      setIsSendingChat(false);
    }
  };

  const handleStartCooking = async () => {
    try {
      const token = localStorage.getItem("token");

      await fetch(
        "http://localhost:3000/api/cooking/start",
        {
          method: "POST",

          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          },

          body: JSON.stringify({
            recipeName: recipe.title,
            ingredients: recipe.ingredients
          })
        }
      );

    } catch (error) {
      console.error(error);
    }

    navigate(`/cooking/${recipe.id}`, {
      state: {
        ingredientSubstitutions,
        recipeData: recipe
      }
    });
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Sticky Header Buttons */}
      <div className="sticky top-0 left-0 right-0 px-6 py-6 z-50 flex justify-between items-center">
        <button
          onClick={() => navigate("/cookbook")}
          className="p-2 bg-black/50 backdrop-blur-sm rounded-full hover:bg-black/60 transition-colors text-white shadow-lg"
        >
          <ArrowLeft className="h-6 w-6" />
        </button>
        <div className="flex gap-2">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleShare}
            className="p-2 bg-black/50 backdrop-blur-sm rounded-full hover:bg-black/60 transition-colors text-white shadow-lg"
          >
            <Share2 className="h-6 w-6" />
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleSave}
            className="p-2 bg-black/50 backdrop-blur-sm rounded-full hover:bg-black/60 transition-colors text-white shadow-lg"
          >
            <Heart className={`h-6 w-6 ${isSaved ? "fill-red-500 text-red-500" : ""}`} />
          </motion.button>
        </div>
      </div>

      {/* Hero Image */}
      <div className="relative h-80 -mt-20">
        <img src={recipe.image} alt={recipe.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-6 left-6 right-6">
          <div className="flex flex-wrap gap-2 mb-2">
            {recipe.isHalal && <Badge className="bg-accent text-accent-foreground shadow-lg">Halal</Badge>}
            {recipe.isVegetarian && <Badge className="bg-primary text-primary-foreground shadow-lg">Vegetarian</Badge>}
            <Badge className="bg-black/50 text-white backdrop-blur-sm shadow-lg">{recipe.type}</Badge>
          </div>
          <h1 className="text-white text-3xl drop-shadow-lg" style={{ fontFamily: 'var(--font-family-display)' }}>
            {recipe.title}
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-md lg:max-w-full mx-auto lg:mx-0 px-6 space-y-6 mt-6">

        {/* Nutrition Info */}
        <div className="bg-card rounded-3xl p-6 shadow-lg">
          <div className="grid grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-medium text-primary">{Math.round((recipe.calories || 0) * servingMultiplier)}</div>
              <div className="text-xs text-muted-foreground">{t("recipe.calories")}</div>
            </div>
            <div>
              <div className="text-2xl font-medium text-primary">{Math.round((recipe.protein || 0) * servingMultiplier)}g</div>
              <div className="text-xs text-muted-foreground">{t("recipe.protein")}</div>
            </div>
            <div>
              <div className="text-2xl font-medium text-primary">{Math.round((recipe.carbs || 0) * servingMultiplier)}g</div>
              <div className="text-xs text-muted-foreground">{t("recipe.carbs")}</div>
            </div>
            <div>
              <div className="text-2xl font-medium text-primary">{displayPrepTime}m</div>
              <div className="text-xs text-muted-foreground">{t("recipe.time")}</div>
            </div>
          </div>
        </div>

        {/* Portion Scaler */}
        <div className="bg-card rounded-3xl p-6 shadow-lg">
          <div className="flex justify-between items-center">
            <h3 className="font-medium">{t("recipe.servings")}</h3>
            <div className="flex items-center gap-4">
              <motion.button whileTap={{ scale: 0.9 }} onClick={() => setServings(Math.max(1, servings - 1))} className="p-2 bg-muted rounded-full hover:bg-muted/80">
                <Minus className="h-4 w-4" />
              </motion.button>
              <motion.span key={servings} initial={{ scale: 1.5 }} animate={{ scale: 1 }} className="text-xl font-medium min-w-[3ch] text-center">{servings}</motion.span>
              <motion.button whileTap={{ scale: 0.9 }} onClick={() => setServings(servings + 1)} className="p-2 bg-muted rounded-full hover:bg-muted/80">
                <Plus className="h-4 w-4" />
              </motion.button>
            </div>
          </div>
        </div>

        {/* AI Taste Tweaker */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className={`bg-gradient-to-r from-accent/10 to-primary/10 rounded-3xl p-4 border-2 cursor-pointer ${user?.isPremium
            ? "border-accent/20"
            : "border-[#D4AF37]/30 bg-gradient-to-r from-[#D4AF37]/5 to-[#E8C968]/5"
            }`}
          onClick={handleTweakerClick}
        >
          <div className="flex items-center gap-3">
            {user?.isPremium ? (
              <Flame className="h-6 w-6 text-accent" />
            ) : (
              <div className="relative">
                <Flame className="h-6 w-6 text-[#D4AF37]" />
                <Lock className="h-3 w-3 text-[#D4AF37] absolute -top-1 -right-1" />
              </div>
            )}
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-medium">AI Taste Tweaker</h3>
                {!user?.isPremium && (
                  <Crown className="h-4 w-4 text-[#D4AF37]" />
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                {user?.isPremium
                  ? t("recipe.tweaker_desc")
                  : t("recipe.tweaker_desc_locked")}
              </p>
            </div>
          </div>
          {showTweaker && user?.isPremium && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mt-4 space-y-2"
            >
              <Button variant="outline" className="w-full rounded-2xl justify-start" onClick={() => handleTweakRequest("spicy")}>{t("recipe.spicier")}</Button>
              <Button variant="outline" className="w-full rounded-2xl justify-start" onClick={() => handleTweakRequest("less-sugar")}>{t("recipe.less_sugar")}</Button>
              <Button variant="outline" className="w-full rounded-2xl justify-start" onClick={() => handleTweakRequest("healthier")}>{t("recipe.healthier")}</Button>
              <Button variant="outline" className="w-full rounded-2xl justify-start" onClick={() => handleTweakRequest("no-chili")}>{t("recipe.no_chili")}</Button>
              <Button variant="outline" className="w-full rounded-2xl justify-start" onClick={() => handleTweakRequest("less-spicy")}>🌶️↓ Kurangi Pedasnya</Button>

              <div className="relative py-2">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-gradient-to-r from-accent/10 to-primary/10 px-2 text-muted-foreground">{t("recipe.custom_pref")}</span>
                </div>
              </div>

              <div className="space-y-2" onClick={(e) => e.stopPropagation()}>
                <input
                  type="text"
                  value={customRequest}
                  onChange={(e) => setCustomRequest(e.target.value)}
                  onKeyPress={(e) => { if (e.key === 'Enter') handleTweakRequest("custom"); }}
                  placeholder={t("recipe.custom_placeholder")}
                  className="w-full rounded-2xl px-4 py-3 bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
                <Button
                  variant="default"
                  className="w-full rounded-2xl"
                  onClick={() => handleTweakRequest("custom")}
                  disabled={!customRequest.trim()}
                >
                  ✨ Ubah Resep
                </Button>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Ingredients */}
        <div className="space-y-4">
          <h2 className="text-xl font-medium">{t("recipe.ingredients")}</h2>
          <div className="space-y-3">
            {(recipe.ingredients || []).map((ingredient, index) => {
              const substitution = ingredientSubstitutions[ingredient.name];
              const hasSubstitution = Boolean(substitution);

              return (
                <motion.div key={index} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.05 }} className="space-y-2">
                  <div className={`flex items-center justify-between p-4 rounded-2xl ${hasSubstitution ? "bg-muted/30 border border-dashed border-muted-foreground/30" : ingredient.available ? "bg-card" : "bg-destructive/5 border-2 border-destructive/20"}`}>
                    <div className="flex items-center gap-3 flex-1">
                      {!ingredient.available && !hasSubstitution && (
                        <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Infinity }}>
                          <AlertCircle className="h-5 w-5 text-destructive" />
                        </motion.div>
                      )}
                      <span className={`font-medium ${hasSubstitution ? "line-through text-muted-foreground" : ""}`}>{ingredient.displayName || ingredient.name}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className={`text-sm ${hasSubstitution ? "line-through text-muted-foreground" : "text-muted-foreground"}`}>
                        {ingredient.amount === null
                          ? localizeUnit(ingredient.unit, language)
                          : `${Math.round(ingredient.amount * servingMultiplier * 10) / 10} ${localizeUnit(ingredient.unit, language)}`
                        }
                      </span>
                      {!ingredient.available && !hasSubstitution && (
                        <motion.button whileHover={{ scale: 1.1 }} animate={{ x: [0, 5, 0] }} transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2 }} onClick={() =>
                          handleAddToShoppingList(ingredient)
                        } className="px-3 py-1 bg-accent text-accent-foreground rounded-full text-xs">
                          {t("shopping.buy")}
                        </motion.button>
                      )}
                    </div>
                  </div>

                  {hasSubstitution && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="pl-4">
                      <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-2 border-green-500/30 rounded-2xl p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <ArrowRight className="h-4 w-4 text-green-600" />
                              <span className="text-xs font-medium text-green-700 dark:text-green-400">{t("recipe.replaced_with")}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="font-medium text-green-900 dark:text-green-100">{substitution.substitute.name}</span>
                              <span className="text-sm font-medium text-green-700 dark:text-green-400">
                                {calculateSubstituteAmount(substitution.substitute.ratio, (ingredient.amount || 1) * servingMultiplier)} {localizeUnit(ingredient.unit, language)}
                              </span>
                            </div>
                            <div className="mt-2 space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="text-xs px-2 py-0.5 bg-green-600/20 text-green-700 dark:text-green-400 rounded-full font-medium">{t("recipe.ratio", { ratio: substitution.substitute.ratio })}</span>
                              </div>
                              {substitution.substitute.note && <p className="text-xs text-muted-foreground italic">💡 {substitution.substitute.note}</p>}
                            </div>
                          </div>
                          <motion.button whileHover={{ scale: 1.1, rotate: 90 }} whileTap={{ scale: 0.9 }} onClick={() => handleRemoveSubstitution(ingredient.name)} className="p-1.5 bg-destructive/10 hover:bg-destructive/20 text-destructive rounded-full transition-colors">
                            <X className="h-4 w-4" />
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {!ingredient.available && !hasSubstitution && (
                    <div className="pl-4">
                      <IngredientSubstituteDropdown ingredientName={ingredient.name} amount={Math.round((ingredient.amount || 1) * servingMultiplier * 10) / 10} unit={ingredient.unit || ""} onSelectSubstitute={(substitute) => { setIngredientSubstitutions(prev => ({ ...prev, [ingredient.name]: { substitute, originalAmount: ingredient.amount || 1, originalUnit: ingredient.unit || "", } })); }} />
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Steps (Tanpa Timer) */}
        <div className="space-y-4">
          <h2 className="text-xl font-medium">{t("recipe.cooking_steps")}</h2>
          <div className="space-y-4">
            {(recipe.steps || []).map((step, index) => {
              return (
                <motion.div key={index} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} className="bg-card rounded-3xl overflow-hidden shadow-lg">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 bg-gradient-to-r from-primary/10 to-accent/10">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg flex-shrink-0">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{t("recipe.step", { count: index + 1 })}</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 space-y-3">
                    <p className="text-sm leading-relaxed">
                      {Object.entries(
                        ingredientSubstitutions
                      ).reduce(
                        (text, [original, data]) =>
                          text.replaceAll(
                            original,
                            data.substitute.name
                          ),
                        step.instruction
                      )}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* AI Sous Chef */}
        <motion.div whileHover={{ scale: 1.02 }} className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-3xl p-4 border-2 border-primary/20 cursor-pointer" onClick={() => setShowChat(!showChat)}>
          <div className="flex items-center gap-3">
            <MessageCircle className="h-6 w-6 text-primary" />
            <div className="flex-1">
              <h3 className="font-medium">{t("recipe.ask_ai")}</h3>
              <p className="text-xs text-muted-foreground">{t("recipe.ask_example")}</p>
            </div>
          </div>
          {showChat && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mt-4 space-y-3" onClick={(e) => e.stopPropagation()}>
              {isLoadingChat && (
                <div className="text-xs text-muted-foreground text-center py-2">{t("chat.loading")}</div>
              )}
              {chatMessages.length > 0 && (
                <div className="max-h-60 overflow-y-auto space-y-2 mb-3">
                  {chatMessages.map((msg, idx) => (
                    <motion.div key={idx} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 ${msg.type === 'user' ? 'bg-primary text-primary-foreground' : 'bg-accent/20 text-foreground border border-accent/30'}`}>
                        {msg.type === 'ai' && (
                          <div className="flex items-center gap-1.5 mb-1">
                            <MessageCircle className="h-3 w-3 text-primary" />
                            <span className="text-xs font-medium text-primary">AI Chef</span>
                          </div>
                        )}
                        <p className="text-sm leading-relaxed">{msg.text}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
              <input type="text" value={chatInput} onChange={(e) => setChatInput(e.target.value)} onKeyPress={(e) => { if (e.key === 'Enter') handleChatSubmit(); }} placeholder={t("recipe.question_placeholder")} className="w-full rounded-2xl px-4 py-3 bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
              <Button size="sm" variant="default" className="w-full rounded-2xl" onClick={handleChatSubmit} disabled={!chatInput.trim() || isSendingChat}>
                <Send className="h-4 w-4 mr-1" /> {isSendingChat ? t("common.loading") : t("recipe.send")}
              </Button>
            </motion.div>
          )}
        </motion.div>

        {/* Rating */}
        <div className="bg-card rounded-3xl p-6 shadow-lg">
          <h3 className="font-medium mb-3">{t("cooking.rate_recipe")}</h3>
          <div className="flex gap-2 mb-3">
            {[1, 2, 3, 4, 5].map((star) => (
              <motion.button key={star} whileHover={!isRatingSaved ? { scale: 1.2 } : {}} whileTap={!isRatingSaved ? { scale: 0.9 } : {}} className={`text-2xl ${isRatingSaved ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'}`} onClick={() => handleRating(star)} onMouseEnter={() => !isRatingSaved && setHoveredStar(star)} onMouseLeave={() => !isRatingSaved && setHoveredStar(0)} disabled={isRatingSaved}>
                <Star className={`h-8 w-8 transition-colors ${star <= (hoveredStar || rating) ? "fill-yellow-400 text-yellow-400" : "fill-none text-muted-foreground"}`} />
              </motion.button>
            ))}
          </div>

          {rating > 0 && !isRatingSaved && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
              <p className="text-sm text-muted-foreground">{t("recipe.selected_rating", { rating })}</p>
              {!showRatingConfirm ? (
                <Button size="sm" variant="default" className="w-full rounded-2xl" onClick={handleSaveRating}>{t("recipe.save_rating")}</Button>
              ) : (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="bg-accent/10 rounded-2xl p-4 space-y-3">
                  <p className="text-sm font-medium">{t("recipe.confirm_rating", { rating })}</p>
                  <div className="flex gap-2">
                    <Button size="sm" variant="default" className="flex-1 rounded-2xl" onClick={confirmSaveRating}>{t("recipe.yes_save")}</Button>
                    <Button size="sm" variant="outline" className="flex-1 rounded-2xl" onClick={cancelSaveRating}>{t("common.cancel")}</Button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}

          {isRatingSaved && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-primary/10 rounded-2xl p-3 border-2 border-primary/20">
              <p className="text-sm font-medium text-primary">✓ Rating {rating} bintang tersimpan</p>
              <p className="text-xs text-muted-foreground mt-1">{t("recipe.thanks_feedback")}</p>
            </motion.div>
          )}
        </div>
      </div>

      {/* Fixed Bottom Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border p-6">
        <div className="max-w-md lg:max-w-full mx-auto lg:mx-0">
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button size="lg" className="w-full rounded-2xl" onClick={handleStartCooking}>
              {t("recipe.start_cooking")}
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
