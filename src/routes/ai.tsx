import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import { PageShell, PageHeader } from "@/components/PageShell";
import { VEHICLES, Vehicle, VehicleCategory } from "@/data/vehicles";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion, AnimatePresence } from "framer-motion";
import {
  Cpu,
  Send,
  Bot,
  User,
  Sparkles,
  ArrowRight,
  Gauge,
  HelpCircle,
  Compass,
  Flame,
  Info,
  Check,
  Settings,
  Star,
  Zap,
  Plus,
} from "lucide-react";

export const Route = createFileRoute("/ai")({
  component: AI,
  head: () => ({ meta: [{ title: "AI Assistant — TECH360" }] }),
});

interface ScoredVehicle {
  vehicle: Vehicle;
  score: number;
  reasons: string[];
}

interface ChatMessage {
  id: string;
  sender: "user" | "bot";
  text: string;
  vehicles?: ScoredVehicle[];
  isIntro?: boolean;
}

// ----------------------------------------------------
// 1. SEMANTIC NATURAL LANGUAGE QUERY PARSER
// ----------------------------------------------------
const parseNaturalLanguageQuery = (query: string) => {
  const q = query.toLowerCase();
  let budget = 200; // default large budget
  let category: VehicleCategory | undefined = undefined;
  let isElectric: boolean | undefined = undefined;
  let seating: number | undefined = undefined;
  let usage: "city" | "highway" | "offroad" | "commercial" | undefined = undefined;
  let fuel: "Petrol" | "Diesel" | "Hybrid" | "Electric" | undefined = undefined;
  let features: string[] = [];

  // Parse budget (e.g. "under 15L", "under 15 Lakhs", "below 1.5 lakh")
  const lakhMatch = q.match(
    /(?:under|below|around|within)?\s*(?:₹|rs\.?)?\s*(\d+(?:\.\d+)?)\s*(?:lakh|l|lakhs)/,
  );
  if (lakhMatch) {
    budget = parseFloat(lakhMatch[1]);
  } else {
    const thousandMatch = q.match(
      /(?:under|below|around|within)?\s*(?:₹|rs\.?)?\s*(\d+)\s*(?:k|thousand|thousands)/,
    );
    if (thousandMatch) {
      budget = parseInt(thousandMatch[1]) / 100;
    }
  }

  // Parse category type
  if (
    q.includes("scooter") ||
    q.includes("activa") ||
    q.includes("vespa") ||
    q.includes("ather") ||
    q.includes("ola")
  ) {
    category = "scooter";
  } else if (
    q.includes("bike") ||
    q.includes("motorcycle") ||
    q.includes("superbike") ||
    q.includes("cruiser") ||
    q.includes("ktm") ||
    q.includes("pulsar") ||
    q.includes("bullet") ||
    q.includes("himalayan")
  ) {
    category = "bike";
  } else if (
    q.includes("car") ||
    q.includes("suv") ||
    q.includes("sedan") ||
    q.includes("hatchback") ||
    q.includes("creta") ||
    q.includes("thar") ||
    q.includes("nexon") ||
    q.includes("swift")
  ) {
    category = "car";
  }

  // Parse electric preference
  if (q.includes("electric") || q.includes("ev") || q.includes("battery") || q.includes("charge")) {
    isElectric = true;
    fuel = "Electric";
    if (category === "car" || !category) {
      category = "ev";
    }
  }

  // Parse fuel type
  if (q.includes("diesel")) {
    fuel = "Diesel";
    isElectric = false;
  } else if (q.includes("petrol")) {
    fuel = "Petrol";
    isElectric = false;
  } else if (q.includes("hybrid")) {
    fuel = "Hybrid";
    isElectric = false;
  }

  // Parse seating layout
  if (
    q.includes("7 seater") ||
    q.includes("7-seater") ||
    q.includes("large family") ||
    q.includes("7 seats")
  ) {
    seating = 7;
  } else if (
    q.includes("5 seater") ||
    q.includes("5-seater") ||
    q.includes("family") ||
    q.includes("5 seats")
  ) {
    seating = 5;
  } else if (
    q.includes("solo") ||
    q.includes("single") ||
    q.includes("college") ||
    q.includes("student")
  ) {
    seating = 1;
  }

  // Parse usage profile
  if (
    q.includes("offroad") ||
    q.includes("off-road") ||
    q.includes("thar") ||
    q.includes("4x4") ||
    q.includes("hill") ||
    q.includes("mountain") ||
    q.includes("dirt")
  ) {
    usage = "offroad";
  } else if (
    q.includes("highway") ||
    q.includes("touring") ||
    q.includes("road trip") ||
    q.includes("high speed") ||
    q.includes("long drive")
  ) {
    usage = "highway";
  } else if (
    q.includes("commute") ||
    q.includes("city") ||
    q.includes("office") ||
    q.includes("traffic") ||
    q.includes("daily")
  ) {
    usage = "city";
  } else if (
    q.includes("cargo") ||
    q.includes("load") ||
    q.includes("delivery") ||
    q.includes("commercial") ||
    q.includes("luggage")
  ) {
    usage = "commercial";
  }

  // Parse specific features
  if (q.includes("sunroof") || q.includes("skyroof")) features.push("Sunroof");
  if (q.includes("adas") || q.includes("cruise")) features.push("ADAS");
  if (q.includes("airbag") || q.includes("safety") || q.includes("safe"))
    features.push("6 Airbags");
  if (q.includes("screen") || q.includes("touchscreen") || q.includes("screen"))
    features.push("Screen");

  return { budget, category, isElectric, seating, usage, fuel, features };
};

// ----------------------------------------------------
// 2. WEIGHTED AI RECOMMENDATION ENGINE
// ----------------------------------------------------
const scoreVehicles = (
  criteria: {
    budget: number;
    category?: VehicleCategory | "ev";
    isElectric?: boolean;
    seating?: number;
    usage?: "city" | "highway" | "offroad" | "commercial";
    fuel?: "Petrol" | "Diesel" | "Hybrid" | "Electric";
    features: string[];
  },
  userBudget: number,
  userUsage: "city" | "highway" | "offroad" | "commercial",
  userSeating: number,
  userFuel: "Petrol" | "Diesel" | "Hybrid" | "Electric" | "All",
  userFeatures: string[],
): ScoredVehicle[] => {
  return VEHICLES.map((v) => {
    let score = 100;
    const reasons: string[] = [];

    // 1. Budget Scorer
    if (v.price > userBudget) {
      const diff = v.price - userBudget;
      score -= Math.min(65, Math.ceil(diff * 12));
      reasons.push(`₹${v.price.toFixed(2)}L slightly exceeds budget limit`);
    } else {
      score += 4;
      reasons.push(`Ex-showroom (₹${v.price.toFixed(2)}L) fits budget comfortably`);
    }

    // 2. Category / Electric match
    if (criteria.category) {
      if (criteria.category === "ev") {
        if (!v.isElectric || (v.category !== "car" && v.category !== "ev")) {
          score -= 50;
        } else {
          score += 15;
          reasons.push("Perfect matching green electric drivetrain");
        }
      } else if (v.category !== criteria.category) {
        score -= 60;
      }
    }

    // 3. Fuel Type preference
    if (userFuel !== "All") {
      if (userFuel === "Electric" && !v.isElectric) {
        score -= 65;
      } else if (
        userFuel === "Hybrid" &&
        !(v.specs.fuel && v.specs.fuel.toLowerCase().includes("hybrid"))
      ) {
        score -= 45;
      } else if (userFuel === "Petrol" && v.specs.fuel !== "Petrol") {
        score -= 35;
      } else if (userFuel === "Diesel" && v.specs.fuel !== "Diesel") {
        score -= 35;
      } else if (v.isElectric && userFuel !== "Electric") {
        score -= 60;
      } else {
        score += 8;
        reasons.push(`Matches fuel preference: ${userFuel}`);
      }
    }

    // 4. Seating Layout
    const capacity = v.specs.seating || 5;
    if (capacity < userSeating) {
      score -= (userSeating - capacity) * 22;
      reasons.push(`Seating capacity (${capacity} passengers) is tighter than requested`);
    } else if (capacity === userSeating) {
      score += 8;
      reasons.push(`Ideal ${capacity}-seater layout for seating needs`);
    }

    // 5. Usage Profile
    if (userUsage === "offroad") {
      const isRugged =
        v.bodyType === "Adventure" ||
        (v.specs.drivetrain &&
          (v.specs.drivetrain.includes("AWD") ||
            v.specs.drivetrain.includes("4WD") ||
            v.specs.drivetrain.includes("RWD")));
      if (isRugged || v.brand === "Mahindra") {
        score += 15;
        reasons.push("Robust build & off-road capability");
      } else {
        score -= 30;
      }
    } else if (userUsage === "highway") {
      const powerVal = parseFloat(v.specs.power) || 0;
      const speedVal = parseFloat(v.specs.topSpeed) || 0;
      if (powerVal > 110 || speedVal > 170) {
        score += 12;
        reasons.push(`Punchy ${v.specs.power} powerplant ideal for fast cruising`);
      } else if (v.category === "scooter") {
        score -= 25;
      }
    } else if (userUsage === "city") {
      if (v.isElectric) {
        score += 12;
        reasons.push("Electric silent motor reduces heavy city commute expenses");
      } else if (v.specs.mileage) {
        const milVal = parseFloat(v.specs.mileage) || 0;
        if (milVal > 18) {
          score += 12;
          reasons.push(`Highly efficient mileage in traffic: ${v.specs.mileage}`);
        }
      }
    } else if (userUsage === "commercial") {
      const isCargo = v.specs.weight || v.name.includes("Star") || v.name.includes("King");
      if (isCargo) {
        score += 15;
        reasons.push("Optimally robust chassis for cargo utility and loading");
      }
    }

    // 6. Checklist wishlists
    userFeatures.forEach((feat) => {
      const term = feat.toLowerCase();
      const hasFeature =
        v.features.some((f) => f.toLowerCase().includes(term)) ||
        v.safety.some((s) => s.toLowerCase().includes(term)) ||
        v.tagline.toLowerCase().includes(term);
      if (hasFeature) {
        score += 10;
        reasons.push(`Equipped with requested ${feat}`);
      } else {
        score -= 5;
      }
    });

    const finalScore = Math.max(12, Math.min(99, score));
    return {
      vehicle: v,
      score: finalScore,
      reasons: reasons.slice(0, 3),
    };
  }).sort((a, b) => b.score - a.score);
};

function AI() {
  const [activeTab, setActiveTab] = useState<"chat" | "wizard">("chat");

  // Chat States
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Set initial welcome message only once
  useEffect(() => {
    setMessages([
      {
        id: "welcome",
        sender: "bot",
        text: 'Namaste! 🙏 I am your TECH360 AI Assistant. I have parsed over 100 Indian-market vehicles with ex-showroom prices, mileage metrics, structural safety ratings, and premium features.\n\nTell me what type of vehicle you are looking for! You can describe your lifestyle, budget, or preferred styling in natural language. Try typing:\n• "Electric scooter under 1.5 lakhs with great digital console"\n• "Robust 4x4 rugged SUV under 25 Lakhs for mountain trips"\n• "Superbike or sports cruiser with high torque under 5L"',
        isIntro: true,
      },
    ]);
  }, []);

  // Wizard States
  const [budget, setBudget] = useState(25); // LAKH INR
  const [usage, setUsage] = useState<"city" | "highway" | "offroad" | "commercial">("city");
  const [seating, setSeating] = useState<number>(5);
  const [fuel, setFuel] = useState<"Petrol" | "Diesel" | "Hybrid" | "Electric" | "All">("All");
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [wizardResults, setWizardResults] = useState<ScoredVehicle[]>([]);
  const [hasGeneratedWizard, setHasGeneratedWizard] = useState(false);

  // Auto-scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Conversational Query handler
  const handleSendMessage = (textToSend?: string) => {
    const rawText = textToSend || chatInput;
    if (!rawText.trim()) return;

    // Append user query
    const userMsg: ChatMessage = {
      id: Math.random().toString(36).substring(7),
      sender: "user",
      text: rawText,
    };
    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setChatInput("");

    setIsTyping(true);

    setTimeout(() => {
      const parsed = parseNaturalLanguageQuery(rawText);

      const scored = scoreVehicles(
        parsed,
        parsed.budget,
        parsed.usage || "city",
        parsed.seating || 5,
        parsed.fuel || "All",
        parsed.features,
      )
        .filter((item) => item.score > 60)
        .slice(0, 3);

      let reply = "";
      if (scored.length === 0) {
        reply = `I analyzed our database for your request, but I couldn't find vehicles that directly match a budget limit of ₹${parsed.budget}L. Try increasing the budget or searching for generic bikes or scooters instead!`;
      } else {
        reply = `Here are the top ${scored.length} recommended vehicles matched to your preferences. I prioritized ₹${parsed.budget.toFixed(1)}L maximum pricing, propulsion (${parsed.fuel || "any fuel"}), and specialized styling:`;
      }

      setMessages((prev) => [
        ...prev,
        {
          id: Math.random().toString(36).substring(7),
          sender: "bot",
          text: reply,
          vehicles: scored,
        },
      ]);
      setIsTyping(false);
    }, 1100);
  };

  const handleSuggestionClick = (query: string) => {
    handleSendMessage(query);
  };

  // Structured Wizard recommendations
  const generateWizardRecommendations = () => {
    const parsedMock = {
      budget,
      usage,
      seating,
      fuel: fuel === "All" ? undefined : fuel,
      features: wishlist,
    };
    const scored = scoreVehicles(parsedMock, budget, usage, seating, fuel, wishlist);
    setWizardResults(scored.slice(0, 6));
    setHasGeneratedWizard(true);
  };

  const toggleWishlist = (feature: string) => {
    setWishlist((prev) =>
      prev.includes(feature) ? prev.filter((f) => f !== feature) : [...prev, feature],
    );
  };

  return (
    <PageShell>
      <PageHeader
        eyebrow="Cognitive AI Engine"
        title="TECH360 AI Recommender"
        description="Experience personalized cognitive matchmaking. Chat naturally with our AI or tweak advanced performance variables to lock onto your perfect vehicle."
      />

      <section className="container mx-auto max-w-7xl px-4 md:px-6 py-10 relative animate-fade-up">
        {/* Floating Spotlight ambient background */}
        <div className="absolute top-[-10%] right-[-5%] w-[45%] aspect-square rounded-full bg-primary/5 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[45%] aspect-square rounded-full bg-emerald-500/5 blur-[120px] pointer-events-none" />

        <Tabs
          value={activeTab}
          onValueChange={(val) => setActiveTab(val as any)}
          className="space-y-8"
        >
          <div className="flex justify-center">
            <TabsList className="grid w-full max-w-md grid-cols-2 bg-muted/30 border border-border/80 p-1.5 rounded-xl shadow-lg backdrop-blur-md">
              <TabsTrigger
                value="chat"
                className="rounded-lg text-sm gap-2 py-2 cursor-pointer transition-all duration-300"
              >
                <Sparkles className="h-4 w-4 text-primary" /> AI Chat Assistant
              </TabsTrigger>
              <TabsTrigger
                value="wizard"
                className="rounded-lg text-sm gap-2 py-2 cursor-pointer transition-all duration-300"
              >
                <Cpu className="h-4 w-4 text-emerald-400" /> Performance Matchmaker
              </TabsTrigger>
            </TabsList>
          </div>

          {/* TAB 1: AI CHAT ASSISTANT */}
          <TabsContent value="chat" className="space-y-6 outline-none">
            <div className="rounded-2xl border border-border bg-card/60 backdrop-blur-xl overflow-hidden flex flex-col h-[550px] md:h-[650px] lg:h-[700px] shadow-2xl relative">
              {/* Message History Feed */}
              <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 bg-muted/5 bg-[linear-gradient(to_right,#80808007_1px,transparent_1px),linear-gradient(to_bottom,#80808007_1px,transparent_1px)] bg-[size:24px_24px]">
                <AnimatePresence initial={false}>
                  {messages.map((msg) => (
                    <div key={msg.id} className="space-y-4">
                      {/* Message Bubble Container */}
                      <motion.div
                        initial={{ opacity: 0, y: 12, scale: 0.99 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 0.35, ease: "easeOut" }}
                        className={`flex gap-3 max-w-[85%] md:max-w-[75%] ${msg.sender === "user" ? "ml-auto flex-row-reverse" : "mr-auto"}`}
                      >
                        {/* Avatar */}
                        {msg.sender === "bot" ? (
                          <div className="relative shrink-0 h-9 w-9">
                            <div className="absolute inset-0 bg-primary/20 rounded-lg animate-ping scale-110" />
                            <div className="absolute inset-0 bg-primary/10 rounded-lg animate-pulse" />
                            <div className="relative h-9 w-9 bg-primary/15 border border-primary/25 rounded-lg flex items-center justify-center text-primary shadow-sm z-10">
                              <Bot className="h-4 w-4" />
                            </div>
                          </div>
                        ) : (
                          <div className="h-9 w-9 bg-primary border border-primary/30 rounded-lg flex items-center justify-center text-primary-foreground shrink-0 shadow-sm">
                            <User className="h-4 w-4" />
                          </div>
                        )}

                        {/* Message Bubble */}
                        <div
                          className={`p-4 rounded-2xl text-sm leading-relaxed border shadow-md ${
                            msg.sender === "user"
                              ? "bg-primary/10 border-primary/20 text-foreground rounded-tr-none"
                              : "bg-card/90 border-border/80 text-foreground rounded-tl-none"
                          }`}
                        >
                          <p className="whitespace-pre-line">{msg.text}</p>
                        </div>
                      </motion.div>

                      {/* Display matched vehicles inside the chat stream as its own full-width row! */}
                      {msg.vehicles && msg.vehicles.length > 0 && (
                        <motion.div
                          initial={{ opacity: 0, y: 16 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, delay: 0.15 }}
                          className="pl-12 w-full max-w-5xl mr-auto animate-fade-up"
                        >
                          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
                            {msg.vehicles.map((item, idx) => (
                              <motion.div
                                key={item.vehicle.id}
                                initial={{ opacity: 0, scale: 0.96 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.3, delay: idx * 0.08 }}
                                className="relative group border border-border bg-card/95 rounded-xl overflow-hidden shadow-lg flex flex-col hover:border-primary/30 hover:shadow-[0_0_20px_rgba(var(--primary-rgb),0.05)] transition-all duration-300 hover:-translate-y-0.5 animate-fade-up"
                              >
                                {/* Glowing match score badge */}
                                <div className="absolute top-3 right-3 z-10">
                                  <Badge className="bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/30 px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider shadow-[0_0_10px_rgba(16,185,129,0.15)]">
                                    {item.score}% Match
                                  </Badge>
                                </div>

                                {/* Preview image */}
                                <div className="aspect-[16/10] overflow-hidden bg-secondary relative">
                                  <img
                                    src={item.vehicle.image}
                                    alt={item.vehicle.name}
                                    loading="lazy"
                                    decoding="async"
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                  />
                                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-60" />
                                </div>

                                <div className="p-4 flex-1 flex flex-col justify-between">
                                  <div>
                                    <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
                                      {item.vehicle.brand}
                                    </span>
                                    <h4 className="font-semibold text-base mt-0.5 group-hover:text-primary transition-colors">
                                      {item.vehicle.name}
                                    </h4>

                                    {/* Smart analytical progress match bar */}
                                    <div className="mt-3.5 space-y-2 border-t border-border/50 pt-3 text-[11px]">
                                      <div className="flex items-center justify-between text-muted-foreground">
                                        <span>Overall Fit index</span>
                                        <span className="font-semibold text-foreground">
                                          {item.score}%
                                        </span>
                                      </div>
                                      <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                                        <div
                                          className="h-full bg-gradient-to-r from-primary to-emerald-400 rounded-full transition-all duration-500"
                                          style={{ width: `${item.score}%` }}
                                        />
                                      </div>
                                    </div>

                                    {/* Rationale factors */}
                                    <div className="mt-3 space-y-1">
                                      {item.reasons.map((r, rIdx) => (
                                        <div
                                          key={rIdx}
                                          className="flex items-start gap-1 text-[11px] text-muted-foreground leading-normal"
                                        >
                                          <Check className="h-3 w-3 text-emerald-400 shrink-0 mt-0.5" />
                                          <span className="line-clamp-1">{r}</span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>

                                  <div className="mt-4 pt-3 border-t border-border flex items-center justify-between">
                                    <span className="font-semibold text-sm">
                                      ₹{item.vehicle.price.toFixed(2)}L
                                    </span>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      className="text-primary hover:underline h-8 px-3 text-xs cursor-pointer"
                                      asChild
                                    >
                                      <Link
                                        to="/vehicles/$slug"
                                        params={{ slug: item.vehicle.slug }}
                                      >
                                        Details <ArrowRight className="h-3.5 w-3.5 ml-1" />
                                      </Link>
                                    </Button>
                                  </div>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </div>
                  ))}
                </AnimatePresence>

                {/* Simulated Typing Indicator */}
                {isTyping && (
                  <div className="flex gap-3 max-w-[80%] mr-auto items-center animate-pulse">
                    <div className="h-9 w-9 bg-primary/10 border border-primary/25 rounded-lg flex items-center justify-center text-primary shrink-0 shadow-sm">
                      <Bot className="h-4 w-4" />
                    </div>
                    <div className="bg-card/90 border border-border/80 p-4 rounded-2xl rounded-tl-none flex items-center gap-1.5 py-3 shadow-md">
                      <span className="h-2 w-2 rounded-full bg-primary animate-bounce delay-100" />
                      <span className="h-2 w-2 rounded-full bg-primary animate-bounce delay-200" />
                      <span className="h-2 w-2 rounded-full bg-primary animate-bounce delay-300" />
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Chat Input controls */}
              <div className="border-t border-border p-4 bg-card/95 backdrop-blur-md space-y-4">
                {/* Suggestions chips */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1.5 scrollbar-none">
                  {[
                    {
                      text: "⚡ Best electric cars or SUVs under ₹25 Lakh",
                      label: "⚡ Premium EVs under 25L",
                    },
                    {
                      text: "🏔️ Rugged 4x4 or AWD SUVs under ₹20L",
                      label: "🏔️ Off-road 4x4s under 20L",
                    },
                    {
                      text: "🏍️ Sporty naked bikes with high mileage for college under 3L",
                      label: "🏍️ Sporty bikes under 3L",
                    },
                    {
                      text: "🎒 Commuter scooters with great charging capacity and high tech",
                      label: "🎒 Commuter scooters",
                    },
                  ].map((chip) => (
                    <Badge
                      key={chip.label}
                      onClick={() => handleSuggestionClick(chip.text)}
                      className="cursor-pointer bg-secondary/40 hover:bg-primary/10 hover:text-primary border border-border/60 hover:border-primary/30 backdrop-blur-sm py-1.5 px-3.5 rounded-full text-xs font-normal whitespace-nowrap transition-all duration-300"
                    >
                      {chip.label}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <Input
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                    className="flex-1 bg-background/50 border-border/80 h-12 rounded-xl focus-visible:ring-1 focus-visible:ring-primary shadow-inner"
                    placeholder="Ask me: 'Show me compact diesel hatchbacks under 10L with great mileage'..."
                  />
                  <Button
                    onClick={() => handleSendMessage()}
                    size="icon"
                    className="h-12 w-12 rounded-xl shrink-0 cursor-pointer shadow-md"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* TAB 2: ADVANCED PERFORMANCE MATCHMAKER WIZARD */}
          <TabsContent value="wizard" className="outline-none">
            <div className="grid lg:grid-cols-[400px_1fr] gap-8">
              {/* Filter controls side panel */}
              <div className="rounded-2xl border border-border bg-card/50 backdrop-blur-xl p-6 h-fit space-y-6 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 aspect-square rounded-full bg-emerald-500/5 blur-3xl pointer-events-none" />

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label className="text-xs uppercase tracking-widest text-muted-foreground">
                      Ex-Showroom Budget
                    </Label>
                    <span className="text-sm font-semibold text-emerald-400">
                      ₹{budget.toFixed(1)} Lakh
                    </span>
                  </div>
                  <Slider
                    value={[budget]}
                    onValueChange={(val) => setBudget(val[0])}
                    min={1}
                    max={120}
                    step={0.5}
                    className="py-4 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
                    <span>₹1 Lakh</span>
                    <span>₹120 Lakh</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs uppercase tracking-widest text-muted-foreground">
                    Usage Profile
                  </Label>
                  <Select value={usage} onValueChange={(val) => setUsage(val as any)}>
                    <SelectTrigger className="bg-background/40 border-border h-11 cursor-pointer">
                      <SelectValue placeholder="Select usage profile" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="city" className="cursor-pointer">
                        City Daily Commuting (Efficiency)
                      </SelectItem>
                      <SelectItem value="highway" className="cursor-pointer">
                        Highway Road-trips (Power/Speed)
                      </SelectItem>
                      <SelectItem value="offroad" className="cursor-pointer">
                        Off-Road Climbing (4x4/AWD)
                      </SelectItem>
                      <SelectItem value="commercial" className="cursor-pointer">
                        Heavy Cargo / Commercial Utility
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs uppercase tracking-widest text-muted-foreground">
                    Seating Capacity
                  </Label>
                  <Select value={String(seating)} onValueChange={(val) => setSeating(Number(val))}>
                    <SelectTrigger className="bg-background/40 border-border h-11 cursor-pointer">
                      <SelectValue placeholder="Select seating size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1" className="cursor-pointer">
                        Solo / Couple Commuter
                      </SelectItem>
                      <SelectItem value="5" className="cursor-pointer">
                        5-Seater Layout (Core Family)
                      </SelectItem>
                      <SelectItem value="7" className="cursor-pointer">
                        7-8 Seater Layout (Large Family)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs uppercase tracking-widest text-muted-foreground">
                    Primary Propulsion
                  </Label>
                  <Select value={fuel} onValueChange={(val) => setFuel(val as any)}>
                    <SelectTrigger className="bg-background/40 border-border h-11 cursor-pointer">
                      <SelectValue placeholder="Select propulsion type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All" className="cursor-pointer">
                        All Fuel Systems
                      </SelectItem>
                      <SelectItem value="Petrol" className="cursor-pointer">
                        Petrol Engines
                      </SelectItem>
                      <SelectItem value="Diesel" className="cursor-pointer">
                        Diesel Engines
                      </SelectItem>
                      <SelectItem value="Hybrid" className="cursor-pointer">
                        Self-Charging Hybrids
                      </SelectItem>
                      <SelectItem value="Electric" className="cursor-pointer">
                        Green Electric (EVs)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Tactile Capsule toggle wishlist tags */}
                <div className="space-y-3.5 pt-2">
                  <Label className="text-xs uppercase tracking-widest text-muted-foreground block">
                    Key Feature Wishlist
                  </Label>
                  <div className="grid grid-cols-2 gap-2.5">
                    {[
                      { key: "Sunroof", label: "Sunroof" },
                      { key: "ADAS", label: "ADAS Level 2" },
                      { key: "6 Airbags", label: "6 Airbags" },
                      { key: "Screen", label: "Digital Console" },
                    ].map((feat) => {
                      const active = wishlist.includes(feat.key);
                      return (
                        <div
                          key={feat.key}
                          onClick={() => toggleWishlist(feat.key)}
                          className={`cursor-pointer border py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 text-xs font-medium transition-all duration-300 ${
                            active
                              ? "bg-primary/10 text-primary border-primary/30 shadow-[0_0_12px_rgba(var(--primary-rgb),0.1)]"
                              : "bg-muted/40 text-muted-foreground border-border/80 hover:bg-muted/70 hover:text-foreground"
                          }`}
                        >
                          {active ? (
                            <Check className="h-3.5 w-3.5 text-primary" />
                          ) : (
                            <Plus className="h-3.5 w-3.5 text-muted-foreground/60" />
                          )}
                          <span>{feat.label}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <Button
                  className="w-full mt-4 h-11 cursor-pointer text-sm font-semibold shadow-md gap-2"
                  onClick={generateWizardRecommendations}
                >
                  <Cpu className="h-4 w-4 text-emerald-400" /> Match Cognitive Index
                </Button>
              </div>

              {/* Match results list */}
              <div>
                {!hasGeneratedWizard ? (
                  <div className="rounded-2xl border border-dashed border-border/80 bg-card/30 p-12 text-center flex flex-col items-center justify-center h-full min-h-[350px] shadow-inner">
                    <Compass className="h-10 w-10 text-muted-foreground/60 mb-4 animate-spin-slow" />
                    <h3 className="font-semibold text-lg">No matches calculated yet</h3>
                    <p className="text-sm text-muted-foreground max-w-sm mt-1.5 leading-relaxed">
                      Select your budget and preference parameters on the left and click match to
                      compute the exact recommendation indexes.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-semibold text-lg tracking-tight">Top Match Results</h3>
                      <p className="text-sm text-muted-foreground mt-0.5">
                        Top matched profiles ranked by weighted ex-showroom cost and usage scores
                      </p>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-5">
                      <AnimatePresence>
                        {wizardResults.map((item, idx) => (
                          <motion.div
                            key={item.vehicle.id}
                            initial={{ opacity: 0, y: 15, scale: 0.97 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.35, delay: idx * 0.08 }}
                            className="relative group border border-border bg-card/65 backdrop-blur-md rounded-2xl overflow-hidden shadow-lg flex flex-col h-full hover:border-emerald-500/20 hover:shadow-[0_0_24px_rgba(16,185,129,0.04)] transition-all duration-300 hover:-translate-y-0.5"
                          >
                            {/* Glowing score badge */}
                            <div className="absolute top-3 right-3 z-10">
                              <Badge className="bg-primary/10 text-primary border-primary/25 px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider shadow-[0_0_10px_rgba(var(--primary-rgb),0.12)]">
                                {item.score}% Match
                              </Badge>
                            </div>

                            {/* Image preview */}
                            <div className="aspect-[16/10] overflow-hidden bg-secondary relative">
                              <img
                                src={item.vehicle.image}
                                alt={item.vehicle.name}
                                loading="lazy"
                                decoding="async"
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-60" />
                            </div>

                            <div className="p-5 flex-1 flex flex-col justify-between">
                              <div>
                                <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium">
                                  {item.vehicle.brand}
                                </span>
                                <h4 className="font-semibold text-lg mt-0.5 group-hover:text-primary transition-colors">
                                  {item.vehicle.name}
                                </h4>

                                {/* Dynamic Match index meter */}
                                <div className="mt-3.5 space-y-2 border-t border-border/50 pt-3 text-[11px]">
                                  <div className="flex items-center justify-between text-muted-foreground">
                                    <span>Fit Index Rating</span>
                                    <span className="font-semibold text-foreground">
                                      {item.score}%
                                    </span>
                                  </div>
                                  <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                                    <div
                                      className="h-full bg-gradient-to-r from-emerald-500 to-primary rounded-full transition-all duration-500"
                                      style={{ width: `${item.score}%` }}
                                    />
                                  </div>
                                </div>

                                {/* Rationale factors */}
                                <div className="mt-4 space-y-1.5">
                                  {item.reasons.map((r, rIdx) => (
                                    <div
                                      key={rIdx}
                                      className="flex items-start gap-1.5 text-xs text-muted-foreground leading-normal"
                                    >
                                      <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                                      <span className="line-clamp-1">{r}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              <div className="mt-6 pt-4 border-t border-border flex items-center justify-between">
                                <div>
                                  <span className="font-bold text-lg">
                                    ₹{item.vehicle.price.toFixed(2)} Lakh
                                  </span>
                                  <p className="text-[9px] text-muted-foreground uppercase tracking-widest mt-0.5">
                                    Avg Ex-Showroom
                                  </p>
                                </div>
                                <Button size="sm" asChild className="group/btn cursor-pointer">
                                  <Link to="/vehicles/$slug" params={{ slug: item.vehicle.slug }}>
                                    Explore{" "}
                                    <ArrowRight className="h-4 w-4 ml-1.5 group-hover/btn:translate-x-0.5 transition-transform" />
                                  </Link>
                                </Button>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </section>
    </PageShell>
  );
}

export default AI;
