import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { PageShell } from "@/components/PageShell";
import { NEWS, VEHICLES } from "@/data/vehicles";
import {
  Search,
  Clock,
  Calendar,
  ChevronRight,
  X,
  MessageSquare,
  Share2,
  Bookmark,
  BookmarkCheck,
  TrendingUp,
  Sparkles,
  ArrowRight,
  Send,
  Zap,
  Info,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/news")({
  head: () => ({ meta: [{ title: "Automotive Newsroom & Reports — TECH360" }] }),
  component: Newsroom,
});

interface Comment {
  name: string;
  text: string;
  time: string;
}

const articleImage = (article: (typeof NEWS)[0]) =>
  article.relatedVehicleId
    ? (VEHICLES.find((v) => v.id === article.relatedVehicleId)?.image ?? article.image)
    : article.image;

function Newsroom() {
  const [selectedTab, setSelectedTab] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<(typeof NEWS)[0] | null>(null);

  // Stateful comments mapped by article ID
  const [articleComments, setArticleComments] = useState<Record<string, Comment[]>>({
    "1": [
      {
        name: "Pranav Kumar",
        text: "The Curvv EV is a styling masterpiece. Standard ICE cars in India are going to feel so dated compared to this coupé layout.",
        time: "2 hours ago",
      },
      {
        name: "Amit Sharma",
        text: "Prismatic cells are a great choice for hot climates. My Nexon EV does great in Delhi heat, so 55kWh Curvv will fly on expressway journeys.",
        time: "1 hour ago",
      },
    ],
    "2": [
      {
        name: "Vikram R.",
        text: "Saw this camo car myself on the Lonavala ghat section! It looked very aggressive, almost like a Lamborghini Urus silhouette.",
        time: "3 hours ago",
      },
    ],
    "5": [
      {
        name: "Suresh Pillai",
        text: "Bought the Rizta last week! The seat is absolutely massive. My wife and son fit comfortably and the floorboard space is very convenient.",
        time: "Yesterday",
      },
    ],
  });

  const [newCommentText, setNewCommentText] = useState<string>("");
  const [commentUserName, setCommentUserName] = useState<string>("");

  const categories = [
    "All",
    "EV Launches",
    "Spy Shots",
    "Two Wheelers",
    "Industry News",
    "Electric Vehicles",
  ];

  // Filter news articles based on tab selection & search query
  const filteredNews = useMemo(() => {
    return NEWS.filter((n) => {
      const matchTab = selectedTab === "All" || n.category === selectedTab;
      const matchSearch =
        n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchTab && matchSearch;
    });
  }, [selectedTab, searchQuery]);

  // Find the top spotlight article
  const spotlightArticle = NEWS[0];
  const gridArticles = filteredNews.filter(
    (n) => n.id !== spotlightArticle.id || selectedTab !== "All",
  );

  const toggleBookmark = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setBookmarkedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const handlePostComment = (articleId: string) => {
    if (!newCommentText.trim()) return;
    const author = commentUserName.trim() || "Anonymous Driver";
    const nextComment: Comment = {
      name: author,
      text: newCommentText,
      time: "Just now",
    };

    setArticleComments((prev) => ({
      ...prev,
      [articleId]: [nextComment, ...(prev[articleId] || [])],
    }));

    setNewCommentText("");
    // Keep username but clear text
  };

  // Find related vehicle if mapped
  const relatedVehicle = selectedArticle?.relatedVehicleId
    ? VEHICLES.find((x) => x.id === selectedArticle.relatedVehicleId)
    : null;

  return (
    <PageShell>
      {/* 1. Neon Live Ticker Tape Marquee */}
      <div className="relative border-b border-border bg-card/60 backdrop-blur-md overflow-hidden py-3 text-xs font-sans tracking-wide">
        <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
        <div className="flex items-center whitespace-nowrap animate-[marquee_30s_linear_infinite] gap-12 font-medium">
          <span className="flex items-center gap-2 text-primary">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping shrink-0" />
            <span className="uppercase font-bold tracking-widest text-[9px] bg-primary/10 px-1.5 py-0.5 rounded">
              Live Ticker
            </span>
          </span>
          <span className="text-muted-foreground">
            🛢️ Brent Crude settles at <strong className="text-foreground">$78.40</strong> per barrel
          </span>
          <span className="text-muted-foreground">
            🔋 Lithium-Ion cell prices fall <strong className="text-emerald-400">-6.5% YoY</strong>{" "}
            globally
          </span>
          <span className="text-muted-foreground">
            🚙 Mahindra BE.05 electric SUV spotted testing expressway validation drafts
          </span>
          <span className="text-muted-foreground">
            📜 Delhi Cabinet extends EV road tax exemptions under FAME-III guidelines
          </span>
          <span className="text-muted-foreground">
            🚘 Maruti Suzuki eVX trial production starts Hansalpur Gujarat assembly lines
          </span>
          <span className="text-muted-foreground">
            🏍️ Royal Enfield classic twins updated bookings list exceeds 15,000 units
          </span>
        </div>
      </div>

      {/* Styled animation keyframes for the marquee directly */}
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
      `}</style>

      {/* Header */}
      <div className="bg-muted/10 border-b border-border py-10 md:py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.005)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.005)_1px,transparent_1px)] bg-[size:3rem_3rem] pointer-events-none" />
        <div className="container mx-auto max-w-7xl px-4 md:px-6 relative z-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary text-[10px] font-semibold uppercase tracking-wider mb-3">
            <Sparkles className="h-3 w-3 text-primary" />
            TECH360 Journal
          </span>
          <h1 className="text-4xl md:text-5xl font-display font-black tracking-tight leading-none bg-gradient-to-r from-foreground via-foreground to-foreground/80 bg-clip-text text-transparent">
            Automotive Newsroom
          </h1>
          <p className="text-sm md:text-base text-muted-foreground mt-3 max-w-2xl leading-relaxed">
            Real-world journalism on the Indian automotive ecosystem. Exploring high-tech EV
            architectures, spy shots, regional policy shifts, and two-wheeler innovations.
          </p>

          {/* Search & Categories Row */}
          <div className="mt-8 flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between border-t border-border/60 pt-6">
            <div className="flex flex-wrap gap-1.5">
              {categories.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setSelectedTab(tab)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-all border ${
                    selectedTab === tab
                      ? "bg-primary text-primary-foreground border-primary shadow-sm shadow-primary/20"
                      : "bg-card border-border text-muted-foreground hover:text-foreground hover:border-foreground/10"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="relative min-w-[280px]">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search news, spy shots, policies..."
                className="pl-9 bg-card border-border focus-visible:ring-primary h-9.5 text-xs rounded-full"
              />
            </div>
          </div>
        </div>
      </div>

      <section className="container mx-auto max-w-7xl px-4 md:px-6 py-12">
        {/* 2. Spotlight Story Card (Shown only when no active filter or filtering All) */}
        {selectedTab === "All" && !searchQuery && spotlightArticle && (
          <div className="mb-12">
            <h2 className="text-xs uppercase tracking-widest font-bold text-muted-foreground mb-4 flex items-center gap-2">
              <TrendingUp className="h-3.5 w-3.5 text-primary" /> Hero Spotlight
            </h2>
            <div
              onClick={() => setSelectedArticle(spotlightArticle)}
              className="group relative rounded-2xl border border-border/80 bg-card overflow-hidden cursor-pointer hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all duration-500 grid md:grid-cols-[1.1fr_1fr] gap-0"
            >
              <div className="aspect-[16/10] md:aspect-auto overflow-hidden relative">
                <img
                  src={articleImage(spotlightArticle)}
                  alt={spotlightArticle.title}
                  loading="eager"
                  decoding="async"
                  className="h-full w-full object-cover group-hover:scale-[1.03] transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent pointer-events-none" />
                <div className="absolute top-4 left-4 flex gap-1.5">
                  {spotlightArticle.tags?.map((t) => (
                    <span
                      key={t}
                      className="bg-primary text-primary-foreground text-[9px] uppercase font-bold tracking-widest px-2.5 py-1 rounded-sm shadow-md"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-6 md:p-10 flex flex-col justify-between bg-gradient-to-br from-card to-muted/20">
                <div>
                  <div className="flex items-center gap-2.5 text-xs text-muted-foreground mb-4">
                    <span className="font-bold text-primary uppercase tracking-widest text-[10px]">
                      {spotlightArticle.category}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {spotlightArticle.readTime}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" /> {spotlightArticle.date}
                    </span>
                  </div>

                  <h3 className="text-2xl md:text-3xl font-display font-black tracking-tight leading-snug text-foreground group-hover:text-primary transition-colors">
                    {spotlightArticle.title}
                  </h3>

                  <p className="text-sm text-muted-foreground mt-4 leading-relaxed line-clamp-3">
                    {spotlightArticle.fullText?.[0] ||
                      "Discover the latest strategic shifts in the Indian passenger vehicle market, as automotive powerhouses scale localized platforms and introduce state-of-the-art software systems to mass consumers."}
                  </p>

                  <div className="grid grid-cols-2 gap-3 mt-6">
                    {spotlightArticle.highlights?.slice(0, 2).map((h, idx) => (
                      <div
                        key={idx}
                        className="flex gap-2 text-xs items-start bg-background/50 border border-border/40 p-2.5 rounded-lg"
                      >
                        <span className="text-primary text-[10px] shrink-0 mt-0.5">⚡</span>
                        <span className="text-muted-foreground line-clamp-2">{h}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-border flex items-center justify-between">
                  <span className="text-xs font-bold text-primary flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    Immersive Read <ArrowRight className="h-3.5 w-3.5" />
                  </span>

                  <button
                    onClick={(e) => toggleBookmark(spotlightArticle.id, e)}
                    className="h-9 w-9 rounded-full border border-border bg-background grid place-items-center hover:text-primary transition-colors"
                  >
                    {bookmarkedIds.includes(spotlightArticle.id) ? (
                      <BookmarkCheck className="h-4 w-4 text-primary fill-primary/10" />
                    ) : (
                      <Bookmark className="h-4 w-4 text-muted-foreground" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 3. News Grid Layout */}
        <h2 className="text-xs uppercase tracking-widest font-bold text-muted-foreground mb-6">
          {selectedTab === "All" && !searchQuery
            ? "More Stories"
            : `${filteredNews.length} articles found`}
        </h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {gridArticles.map((n) => (
            <article
              key={n.id}
              onClick={() => setSelectedArticle(n)}
              className="group rounded-xl border border-border bg-card overflow-hidden hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="aspect-[16/10] overflow-hidden relative bg-muted">
                  <img
                    src={articleImage(n)}
                    alt={n.title}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent pointer-events-none" />
                  <div className="absolute top-3 left-3 flex gap-1">
                    {n.tags?.map((t) => (
                      <span
                        key={t}
                        className="bg-primary/90 text-primary-foreground text-[8px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-sm"
                      >
                        {t}
                      </span>
                    ))}
                  </div>

                  <button
                    onClick={(e) => toggleBookmark(n.id, e)}
                    className="absolute top-3 right-3 h-8 w-8 rounded-full border border-white/10 bg-black/40 backdrop-blur-md grid place-items-center text-white hover:bg-primary transition-colors"
                  >
                    {bookmarkedIds.includes(n.id) ? (
                      <BookmarkCheck className="h-3.5 w-3.5 text-primary-foreground" />
                    ) : (
                      <Bookmark className="h-3.5 w-3.5" />
                    )}
                  </button>
                </div>

                <div className="p-5">
                  <div className="flex items-center gap-2.5 text-[10px] text-muted-foreground mb-3 uppercase tracking-wider font-semibold">
                    <span className="text-primary">{n.category}</span>
                    <span>•</span>
                    <span>{n.readTime}</span>
                  </div>

                  <h3 className="text-base font-bold leading-snug group-hover:text-primary transition-colors text-foreground line-clamp-2">
                    {n.title}
                  </h3>

                  <p className="text-xs text-muted-foreground mt-3 line-clamp-2 leading-relaxed">
                    {n.fullText?.[0] ||
                      "Expert analysis covering recent automotive design cycles, localized manufacturing investments, and structural updates in high-volume categories."}
                  </p>
                </div>
              </div>

              <div className="px-5 pb-5 pt-4 border-t border-border/40 flex items-center justify-between text-[11px] text-muted-foreground bg-muted/10">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" /> {n.date}
                </span>
                <span className="text-primary font-bold flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  Read Report <ChevronRight className="h-3 w-3" />
                </span>
              </div>
            </article>
          ))}
        </div>

        {filteredNews.length === 0 && (
          <div className="text-center py-20 bg-card border border-dashed border-border rounded-2xl">
            <Search className="h-8 w-8 text-muted-foreground mx-auto opacity-50 mb-3" />
            <p className="font-semibold text-foreground text-sm">
              No articles match your search parameters
            </p>
            <p className="text-xs text-muted-foreground mt-1 mb-4">
              Try clearing active tabs or adjusting text queries.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchQuery("");
                setSelectedTab("All");
              }}
            >
              Reset Filters
            </Button>
          </div>
        )}
      </section>

      {/* 4. Sliding Immersive Reading Drawer Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-md z-50 overflow-y-auto px-4 py-8 md:py-16 animate-fade-in flex justify-center">
          <div className="relative bg-card border border-border rounded-2xl w-full max-w-5xl shadow-2xl overflow-hidden flex flex-col md:grid md:grid-cols-[1.4fr_1fr] gap-0 h-fit max-h-[85vh] md:max-h-[90vh]">
            {/* Left Main Stream: Reading Column */}
            <div className="p-6 md:p-10 overflow-y-auto border-r border-border custom-scrollbar">
              {/* Back Button */}
              <button
                onClick={() => setSelectedArticle(null)}
                className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mb-6"
              >
                ← Back to Newsroom
              </button>

              <div className="flex items-center gap-2.5 text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                <span className="text-primary">{selectedArticle.category}</span>
                <span>•</span>
                <span>{selectedArticle.readTime}</span>
              </div>

              <h2 className="text-xl md:text-3xl font-display font-black tracking-tight leading-tight mt-3 text-foreground">
                {selectedArticle.title}
              </h2>

              <div className="flex items-center gap-3 text-xs text-muted-foreground mt-4 pb-4 border-b border-border">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" /> {selectedArticle.date}
                </span>
                <span>·</span>
                <span className="font-bold text-foreground">TECH360 Journalism Desk</span>
              </div>

              {/* Full Detailed Paragraphs */}
              <div className="mt-6 space-y-5 text-sm md:text-base leading-relaxed text-muted-foreground/90 font-sans">
                {selectedArticle.fullText?.map((p, idx) => (
                  <p
                    key={idx}
                    className={
                      idx === 0
                        ? "text-foreground font-medium md:text-lg leading-relaxed first-letter:text-4xl first-letter:font-bold first-letter:text-primary first-letter:float-left first-letter:mr-2"
                        : ""
                    }
                  >
                    {p}
                  </p>
                ))}

                {(!selectedArticle.fullText || selectedArticle.fullText.length === 0) && (
                  <p>
                    Journalistic report details for this specific industry announcement are being
                    synthesized. Check back for real-time pricing analysis and technical
                    specification listings.
                  </p>
                )}
              </div>

              {/* Related Model linkage card */}
              {relatedVehicle && (
                <div className="mt-8 p-5 rounded-xl border border-primary/20 bg-primary/5 flex flex-col md:flex-row items-center gap-4 justify-between">
                  <div className="flex gap-4 items-center">
                    <img
                      src={relatedVehicle.image}
                      alt={relatedVehicle.name}
                      loading="lazy"
                      decoding="async"
                      className="h-14 w-20 rounded-md object-cover border border-border"
                    />
                    <div>
                      <h4 className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">
                        Related Vehicle
                      </h4>
                      <p className="font-bold text-sm text-foreground">
                        {relatedVehicle.brand} {relatedVehicle.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Ex-Showroom: ₹{relatedVehicle.price.toFixed(2)} Lakh
                      </p>
                    </div>
                  </div>
                  <Button size="sm" asChild className="rounded-full shrink-0">
                    <Link to="/vehicles/$slug" params={{ slug: relatedVehicle.slug }}>
                      Explore Specs <ChevronRight className="h-3.5 w-3.5 ml-1" />
                    </Link>
                  </Button>
                </div>
              )}

              {/* Comments drawer */}
              <div className="mt-10 pt-8 border-t border-border">
                <h3 className="text-base font-bold text-foreground mb-4 flex items-center gap-2">
                  <MessageSquare className="h-4.5 w-4.5 text-primary" /> Discussion (
                  {articleComments[selectedArticle.id]?.length || 0})
                </h3>

                {/* Comment Post Box */}
                <div className="bg-background border border-border p-4 rounded-xl space-y-3 shadow-inner">
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      value={commentUserName}
                      onChange={(e) => setCommentUserName(e.target.value)}
                      placeholder="Your Name (optional)"
                      className="bg-card border-border text-xs h-8 focus-visible:ring-primary"
                    />
                    <span className="text-[10px] text-muted-foreground flex items-center justify-end gap-1">
                      <Info className="h-3 w-3" /> Live Verified Feed
                    </span>
                  </div>
                  <textarea
                    value={newCommentText}
                    onChange={(e) => setNewCommentText(e.target.value)}
                    placeholder="Share your technical opinion or market feedback on this article..."
                    className="w-full bg-card border border-border p-3 rounded-lg text-xs h-20 outline-none focus:ring-1 focus:ring-primary/40 font-sans text-foreground resize-none"
                  />
                  <div className="flex justify-end">
                    <Button
                      size="sm"
                      onClick={() => handlePostComment(selectedArticle.id)}
                      disabled={!newCommentText.trim()}
                      className="h-8 text-xs font-semibold px-4 rounded-full"
                    >
                      Post Comment <Send className="h-3 w-3 ml-1.5" />
                    </Button>
                  </div>
                </div>

                {/* Comment Feed */}
                <div className="mt-6 space-y-4 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                  {articleComments[selectedArticle.id]?.map((c, idx) => (
                    <div
                      key={idx}
                      className="p-3 border border-border bg-card/40 rounded-lg text-xs"
                    >
                      <div className="flex justify-between items-center mb-1">
                        <strong className="text-foreground flex items-center gap-1">
                          <span className="h-4 w-4 rounded-full bg-primary/10 text-primary text-[9px] font-bold grid place-items-center">
                            {c.name.charAt(0).toUpperCase()}
                          </span>
                          {c.name}
                        </strong>
                        <span className="text-[9px] text-muted-foreground">{c.time}</span>
                      </div>
                      <p className="text-muted-foreground/90 mt-1.5 font-sans leading-relaxed">
                        {c.text}
                      </p>
                    </div>
                  ))}

                  {(!articleComments[selectedArticle.id] ||
                    articleComments[selectedArticle.id].length === 0) && (
                    <p className="text-xs text-muted-foreground text-center py-6">
                      No technical comments posted yet. Be the first to share your opinion!
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Right Sticky Side Panel: Highlights, Spec-Box & Sharing */}
            <div className="p-6 md:p-10 bg-muted/10 overflow-y-auto flex flex-col justify-between custom-scrollbar">
              <div>
                {/* Floating Close Button */}
                <div className="flex justify-end md:absolute md:top-4 md:right-4 z-10">
                  <button
                    onClick={() => setSelectedArticle(null)}
                    className="h-8 w-8 rounded-full border border-border bg-card text-muted-foreground hover:text-foreground hover:border-foreground/20 transition-all grid place-items-center"
                    title="Close Reader"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <div className="aspect-[16/10] w-full overflow-hidden rounded-xl border border-border mb-6">
                  <img
                    src={articleImage(selectedArticle)}
                    alt={selectedArticle.title}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Key Takeaway Box */}
                <div className="rounded-xl border border-border bg-card p-5 mb-6">
                  <h4 className="text-xs uppercase tracking-widest text-primary font-bold mb-3 flex items-center gap-1.5">
                    <Zap className="h-3.5 w-3.5 fill-primary/15" /> Key Highlights
                  </h4>
                  <ul className="space-y-3">
                    {selectedArticle.highlights?.map((h, i) => (
                      <li
                        key={i}
                        className="text-xs text-muted-foreground/90 flex gap-2 leading-relaxed items-start"
                      >
                        <span className="text-primary font-bold shrink-0 mt-0.5">•</span>
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Dynamic Fact Sheet Box */}
                {relatedVehicle && (
                  <div className="rounded-xl border border-border bg-card p-5">
                    <h4 className="text-xs uppercase tracking-widest text-muted-foreground font-bold mb-3">
                      📰 Spec Reference
                    </h4>
                    <div className="divide-y divide-border/60 text-xs">
                      <div className="flex justify-between py-2">
                        <span className="text-muted-foreground">Ex-Showroom Price</span>
                        <strong className="text-foreground">
                          ₹{relatedVehicle.price.toFixed(2)} Lakh
                        </strong>
                      </div>
                      <div className="flex justify-between py-2">
                        <span className="text-muted-foreground">
                          {relatedVehicle.isElectric ? "Battery Capacity" : "Engine Capacity"}
                        </span>
                        <strong className="text-foreground">
                          {relatedVehicle.specs.battery || relatedVehicle.specs.engine}
                        </strong>
                      </div>
                      <div className="flex justify-between py-2">
                        <span className="text-muted-foreground">Certified Power</span>
                        <strong className="text-foreground">{relatedVehicle.specs.power}</strong>
                      </div>
                      <div className="flex justify-between py-2">
                        <span className="text-muted-foreground">
                          {relatedVehicle.isElectric ? "Electric Range" : "Avg Mileage"}
                        </span>
                        <strong className="text-foreground">
                          {relatedVehicle.specs.range || relatedVehicle.specs.mileage}
                        </strong>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Action utilities */}
              <div className="mt-8 pt-6 border-t border-border flex items-center gap-2">
                <Button
                  onClick={(e) => toggleBookmark(selectedArticle.id, e)}
                  variant="outline"
                  className="flex-1 rounded-full text-xs font-semibold h-9.5 border-border"
                >
                  {bookmarkedIds.includes(selectedArticle.id) ? (
                    <>Bookmarked</>
                  ) : (
                    <>Bookmark Report</>
                  )}
                </Button>

                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => alert("News URL copied to clipboard under TECH360 domain.")}
                  className="h-9.5 w-9.5 rounded-full border-border"
                  title="Share Report"
                >
                  <Share2 className="h-4 w-4 text-muted-foreground" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </PageShell>
  );
}
