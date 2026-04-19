import { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ChevronLeft, ChevronRight, Check, MessageCircle, Timer, Play, Pause, RotateCcw as RotateCcwIcon, Clock, ShoppingBag, Lightbulb, ArrowRight } from "lucide-react";
import { Button } from "../../../ui/button.jsx";
import { Progress } from "../../../ui/progress";
import { mockRecipes } from "../../lib/data";
import { toast } from "sonner";

export default function CookingModeScreen() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const recipe = mockRecipes.find((r) => r.id === id) || mockRecipes[0];
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [showChat, setShowChat] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [hasTimerStarted, setHasTimerStarted] = useState(false);

  // Get ingredient substitutions from navigation state
  const ingredientSubstitutions = location.state?.ingredientSubstitutions || {};

  const progress = ((completedSteps.length) / recipe.steps.length) * 100;
  const currentStepData = recipe.steps[currentStep];
  const stepTimer = currentStepData.timer || 0;

  // Function to check if current step uses substituted ingredients
  const getStepSubstitutions = (step) => {
    const substitutionsInStep = [];

    Object.keys(ingredientSubstitutions).forEach(originalIngredient => {
      const substitution = ingredientSubstitutions[originalIngredient];

      // Check in step instruction
      if (step.instruction.toLowerCase().includes(originalIngredient.toLowerCase())) {
        substitutionsInStep.push({
          original: originalIngredient,
          substitute: substitution.substitute.name,
          ratio: substitution.substitute.ratio,
          note: substitution.substitute.note
        });
      }

      // Check in step ingredients
      if (step.ingredients) {
        step.ingredients.forEach(ing => {
          if (ing.toLowerCase().includes(originalIngredient.toLowerCase())) {
            // Check if not already added
            if (!substitutionsInStep.find(s => s.original === originalIngredient)) {
              substitutionsInStep.push({
                original: originalIngredient,
                substitute: substitution.substitute.name,
                ratio: substitution.substitute.ratio,
                note: substitution.substitute.note
              });
            }
          }
        });
      }
    });

    return substitutionsInStep;
  };

  const stepSubstitutions = getStepSubstitutions(currentStepData);
  const hasSubstitutions = stepSubstitutions.length > 0;

  // Reset timer when step changes
  useEffect(() => {
    setTimeRemaining(stepTimer);
    setIsTimerRunning(false);
    setHasTimerStarted(false);
  }, [currentStep, stepTimer]);

  const handleNext = () => {
    if (!completedSteps.includes(currentStep)) {
      setCompletedSteps([...completedSteps, currentStep]);
    }
    if (currentStep < recipe.steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      toast.success("Selamat! Masakan Anda selesai! 🎉");
      navigate("/home");
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const startTimer = () => {
    setIsTimerRunning(true);
    setHasTimerStarted(true);
  };

  const pauseTimer = () => {
    setIsTimerRunning(false);
  };

  const resetTimer = () => {
    setTimeRemaining(stepTimer);
    setIsTimerRunning(false);
  };

  // Timer countdown effect
  useEffect(() => {
    let interval;
    if (isTimerRunning && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            setIsTimerRunning(false);
            toast.success("Timer selesai! ⏰", {
              description: "Lanjut ke langkah berikutnya",
            });
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timeRemaining]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="bg-primary text-primary-foreground px-6 py-4">
        <div className="max-w-md lg:max-w-full mx-auto lg:mx-0 space-y-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(`/recipe/${recipe.id}`)}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <ArrowLeft className="h-6 w-6" />
            </button>
            <h1 className="text-lg font-medium">Mode Memasak</h1>
            <div className="w-10" />
          </div>

          {/* Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Langkah {currentStep + 1} dari {recipe.steps.length}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </div>
      </div>

      {/* Current Step - Large Display */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div className="max-w-md lg:max-w-full mx-auto lg:mx-0 space-y-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              {/* Step Image */}
              {currentStepData.image && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 }}
                  className="relative h-64 rounded-3xl overflow-hidden shadow-xl"
                >
                  <img
                    src={currentStepData.image}
                    alt={`Langkah ${currentStep + 1}`}
                    className="w-full h-full object-cover"
                  />
                  {/* Step Number Overlay */}
                  <div className="absolute top-4 left-4 w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold shadow-lg">
                    {currentStep + 1}
                  </div>
                  {/* Timer Badge if available */}
                  {stepTimer > 0 && (
                    <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm text-white px-3 py-1.5 rounded-full flex items-center gap-1.5 text-sm">
                      <Clock className="h-4 w-4" />
                      <span>{Math.floor(stepTimer / 60)}:{(stepTimer % 60).toString().padStart(2, '0')}</span>
                    </div>
                  )}
                </motion.div>
              )}

              {/* Substitution Notice - Show if this step uses substituted ingredients */}
              {hasSubstitutions && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                  className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-2 border-green-500/30 rounded-3xl p-4 shadow-lg"
                >
                  <div className="flex items-start gap-3">
                    <RotateCcwIcon className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <div className="flex-1 space-y-2">
                      <p className="text-sm font-medium text-green-700 dark:text-green-400">
                        🔄 Gunakan bahan pengganti untuk langkah ini:
                      </p>
                      {stepSubstitutions.map((sub, subIdx) => (
                        <div
                          key={subIdx}
                          className="bg-green-600/10 rounded-2xl px-3 py-2 border border-green-600/20"
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm line-through text-muted-foreground">
                              {sub.original}
                            </span>
                            <ArrowRight className="h-4 w-4 text-green-600" />
                            <span className="text-sm font-medium text-green-900 dark:text-green-100">
                              {sub.substitute}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs px-2 py-0.5 bg-green-600/20 text-green-700 dark:text-green-400 rounded-full font-medium">
                              Rasio {sub.ratio}
                            </span>
                          </div>
                          {sub.note && (
                            <p className="text-xs text-muted-foreground italic mt-1.5">
                              💡 {sub.note}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Timer Controls - Always show */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className={`rounded-3xl p-6 border-2 ${stepTimer === 0
                    ? 'bg-muted/20 border-muted/30'
                    : 'bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20'
                  }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Timer className={`h-5 w-5 ${stepTimer === 0 ? 'text-muted-foreground' : 'text-primary'}`} />
                    <span className="font-medium">Timer Memasak</span>
                  </div>
                </div>

                {/* Timer Display */}
                <div className="text-center mb-4">
                  <motion.div
                    animate={{
                      scale: isTimerRunning && timeRemaining <= 10 && timeRemaining > 0 ? [1, 1.1, 1] : 1,
                    }}
                    transition={{ duration: 1, repeat: isTimerRunning && timeRemaining <= 10 ? Infinity : 0 }}
                    className={`text-6xl font-bold ${stepTimer === 0
                        ? 'text-muted-foreground'
                        : timeRemaining === 0
                          ? 'text-primary'
                          : timeRemaining <= 10
                            ? 'text-accent'
                            : 'text-foreground'
                      }`}
                  >
                    {formatTime(timeRemaining)}
                  </motion.div>
                  <p className="text-sm text-muted-foreground mt-2">
                    {stepTimer === 0
                      ? "Tidak ada timer untuk langkah ini"
                      : timeRemaining === 0
                        ? "Waktu habis! ✅"
                        : isTimerRunning
                          ? "Timer berjalan..."
                          : hasTimerStarted
                            ? "Timer dijeda"
                            : "Siap memulai"}
                  </p>
                </div>

                {/* Timer Buttons */}
                <div className="flex gap-2">
                  {!hasTimerStarted || timeRemaining === 0 ? (
                    <Button
                      onClick={startTimer}
                      disabled={stepTimer === 0 || (timeRemaining === 0 && hasTimerStarted)}
                      className="flex-1 rounded-2xl"
                      size="lg"
                    >
                      <Play className="h-5 w-5 mr-2" />
                      Mulai Timer
                    </Button>
                  ) : (
                    <>
                      <Button
                        onClick={isTimerRunning ? pauseTimer : startTimer}
                        variant="outline"
                        className="flex-1 rounded-2xl"
                        size="lg"
                      >
                        {isTimerRunning ? (
                          <>
                            <Pause className="h-5 w-5 mr-2" />
                            Jeda
                          </>
                        ) : (
                          <>
                            <Play className="h-5 w-5 mr-2" />
                            Lanjut
                          </>
                        )}
                      </Button>
                      <Button
                        onClick={resetTimer}
                        variant="outline"
                        className="rounded-2xl"
                        size="lg"
                      >
                        <RotateCcwIcon className="h-5 w-5" />
                      </Button>
                    </>
                  )}
                </div>
              </motion.div>

              {/* Ingredients for this step */}
              {currentStepData.ingredients && currentStepData.ingredients.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-accent/10 rounded-3xl p-5 border border-accent/20"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <ShoppingBag className="h-5 w-5 text-accent" />
                    <h3 className="font-medium">Bahan untuk Langkah Ini:</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {currentStepData.ingredients.map((ing, idx) => (
                      <span
                        key={idx}
                        className="bg-background px-3 py-1.5 rounded-full text-sm border border-accent/20"
                      >
                        {ingredientSubstitutions[ing] || ing}
                      </span>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Step Instruction */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="bg-white rounded-3xl p-6 shadow-lg"
              >
                <p className="text-lg leading-relaxed">
                  {currentStepData.instruction}
                </p>
              </motion.div>

              {/* Tips */}
              {currentStepData.tips && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="bg-primary/5 border-l-4 border-primary rounded-r-3xl p-5"
                >
                  <div className="flex items-start gap-2">
                    <Lightbulb className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-primary mb-1">
                        💡 Tips untuk Pemula:
                      </p>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {currentStepData.tips}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Completed Indicator */}
              {completedSteps.includes(currentStep) && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="flex items-center justify-center gap-2 text-primary py-3 bg-primary/5 rounded-2xl"
                >
                  <Check className="h-5 w-5" />
                  <span className="text-sm font-medium">Langkah selesai!</span>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="bg-white border-t border-border px-6 py-6">
        <div className="max-w-md lg:max-w-full mx-auto lg:mx-0 space-y-4">
          <div className="flex gap-3">
            <Button
              variant="outline"
              size="lg"
              onClick={handlePrev}
              disabled={currentStep === 0}
              className="rounded-2xl"
            >
              <ChevronLeft className="h-5 w-5 mr-1" />
              Kembali
            </Button>

            <Button
              size="lg"
              onClick={handleNext}
              className="flex-1 rounded-2xl"
            >
              {currentStep === recipe.steps.length - 1 ? (
                "Selesai! 🎉"
              ) : (
                <>
                  Lanjut
                  <ChevronRight className="h-5 w-5 ml-1" />
                </>
              )}
            </Button>
          </div>

          {/* All Steps Quick View */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {recipe.steps.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentStep(index)}
                className={`flex-shrink-0 w-10 h-10 rounded-full border-2 flex items-center justify-center text-sm transition-all ${index === currentStep
                    ? "border-primary bg-primary text-primary-foreground"
                    : completedSteps.includes(index)
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border bg-background"
                  }`}
              >
                {completedSteps.includes(index) ? (
                  <Check className="h-4 w-4" />
                ) : (
                  index + 1
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* AI Sous Chef Chat Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setShowChat(!showChat)}
        className="fixed bottom-24 right-6 w-14 h-14 bg-accent text-accent-foreground rounded-full shadow-lg flex items-center justify-center z-50"
      >
        <MessageCircle className="h-6 w-6" />
      </motion.button>

      {/* Chat Popup */}
      <AnimatePresence>
        {showChat && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-40 right-6 w-64 bg-white rounded-3xl shadow-2xl p-4 border border-border z-50"
          >
            <h3 className="font-medium mb-2">AI Sous-Chef 🧑‍🍳</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Ada yang ingin ditanyakan tentang langkah ini?
            </p>
            <div className="space-y-2">
              <button className="w-full text-left text-sm p-2 bg-muted rounded-xl hover:bg-muted/80">
                "Berapa lama harus ditumis?"
              </button>
              <button className="w-full text-left text-sm p-2 bg-muted rounded-xl hover:bg-muted/80">
                "Bisa ganti bahan ini?"
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}