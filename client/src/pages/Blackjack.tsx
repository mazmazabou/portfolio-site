import { useState, useCallback } from "react";
import { Link } from "wouter";
import { ArrowLeft, RotateCcw, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  dealInitialHands,
  playerHit,
  playerStay,
  getBestScore,
  getSuitSymbol,
  getTypeLabel,
  getSuitColor,
  type BlackjackState,
  type GameResult,
} from "@/lib/games/blackjack";

// ---- Card Component ----

function PlayingCard({
  cardId,
  faceDown = false,
  index = 0,
}: {
  cardId: number;
  faceDown?: boolean;
  index?: number;
}) {
  const suit = getSuitSymbol(cardId);
  const type = getTypeLabel(cardId);
  const color = getSuitColor(cardId);

  return (
    <motion.div
      initial={{ x: 80, opacity: 0, rotateY: faceDown ? 180 : 0 }}
      animate={{ x: 0, opacity: 1, rotateY: 0 }}
      transition={{ delay: index * 0.12, duration: 0.35, ease: "easeOut" }}
      className="relative shrink-0"
    >
      <div
        className="w-[72px] h-[104px] sm:w-[88px] sm:h-[128px] rounded-lg flex flex-col justify-between p-1.5 sm:p-2 select-none"
        style={{
          background: faceDown
            ? "linear-gradient(135deg, #1a2744 0%, #162036 100%)"
            : "linear-gradient(180deg, #f8fafc 0%, #e2e8f0 100%)",
          boxShadow:
            "0 2px 8px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.08)",
        }}
      >
        {faceDown ? (
          // Card back — subtle Ottoman-inspired pattern
          <div className="absolute inset-[4px] rounded border border-primary/20 flex items-center justify-center overflow-hidden">
            <div
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 4px, rgba(212,168,83,0.3) 4px, rgba(212,168,83,0.3) 5px),
                  repeating-linear-gradient(-45deg, transparent, transparent 4px, rgba(212,168,83,0.3) 4px, rgba(212,168,83,0.3) 5px)`,
              }}
            />
            <div className="w-6 h-6 sm:w-8 sm:h-8 border border-primary/30 rounded-full flex items-center justify-center">
              <div className="w-3 h-3 sm:w-4 sm:h-4 border border-primary/20 rounded-full" />
            </div>
          </div>
        ) : (
          <>
            {/* Top-left */}
            <div className="flex flex-col items-start leading-none">
              <span
                className={`text-sm sm:text-base font-bold ${color === "red" ? "text-red-600" : "text-slate-800"}`}
              >
                {type}
              </span>
              <span
                className={`text-xs sm:text-sm ${color === "red" ? "text-red-600" : "text-slate-800"}`}
              >
                {suit}
              </span>
            </div>

            {/* Center suit */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span
                className={`text-2xl sm:text-3xl ${color === "red" ? "text-red-500" : "text-slate-700"}`}
              >
                {suit}
              </span>
            </div>

            {/* Bottom-right (inverted) */}
            <div className="flex flex-col items-end leading-none rotate-180">
              <span
                className={`text-sm sm:text-base font-bold ${color === "red" ? "text-red-600" : "text-slate-800"}`}
              >
                {type}
              </span>
              <span
                className={`text-xs sm:text-sm ${color === "red" ? "text-red-600" : "text-slate-800"}`}
              >
                {suit}
              </span>
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
}

// ---- Result Display ----

const resultConfig: Record<
  Exclude<GameResult, "playing">,
  { label: string; color: string }
> = {
  blackjack: { label: "Blackjack!", color: "text-primary" },
  player_win: { label: "You Win!", color: "text-emerald-400" },
  dealer_bust: { label: "Dealer Busts!", color: "text-emerald-400" },
  player_bust: { label: "Bust!", color: "text-red-400" },
  dealer_win: { label: "Dealer Wins", color: "text-red-400" },
  push: { label: "Push", color: "text-muted-foreground" },
};

// ---- Main Component ----

export default function Blackjack() {
  const [game, setGame] = useState<BlackjackState>(() => dealInitialHands());
  const [gameNum, setGameNum] = useState(1);
  const [hoodOpen, setHoodOpen] = useState(false);

  const isOver = game.result !== "playing";
  const playerScore = getBestScore(game.playerHand);
  const dealerScore = getBestScore(game.dealerHand);
  const showDealerCards = isOver;

  const hit = useCallback(() => {
    setGame((g) => playerHit(g));
  }, []);

  const stay = useCallback(() => {
    setGame((g) => playerStay(g));
  }, []);

  const newGame = useCallback(() => {
    setGame(dealInitialHands());
    setGameNum((n) => n + 1);
  }, []);

  return (
    <div className="px-6 pb-24 animate-in fade-in duration-700">
      <div className="pt-8 mb-8">
        <Link
          href="/"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft size={16} className="mr-2" /> Back to Portfolio
        </Link>
      </div>

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
            <div>
              <p className="font-mono text-sm text-primary mb-2">
                CSCI 103 — Introduction to Computer Science, USC
              </p>
              <h1 className="text-3xl md:text-5xl font-serif text-white">
                Blackjack (Twenty-One)
              </h1>
            </div>
            <span className="text-[10px] uppercase tracking-wider px-2 py-1 bg-primary/10 text-primary border border-primary/20 rounded shrink-0 w-fit h-fit">
              C++ &middot; Playable Demo
            </span>
          </div>

          <div className="flex flex-wrap gap-2 mb-8">
            {[
              "C++",
              "Fisher-Yates Shuffle",
              "Game Logic",
              "Card Rendering",
              "Soft/Hard Aces",
            ].map((tag) => (
              <span
                key={tag}
                className="text-xs text-muted-foreground border-b border-muted-foreground/30 pb-0.5"
              >
                #{tag}
              </span>
            ))}
          </div>

          <div className="prose prose-invert prose-p:text-muted-foreground prose-p:leading-relaxed max-w-none">
            <p>
              A full Blackjack game ported from a CSCI 103 C++ assignment. The
              deck uses Fisher-Yates (Durstenfeld variant) for shuffling, Aces
              dynamically switch between 11 and 1 to maximize your hand, and the
              dealer draws to 17. Every rule is a direct translation of the
              original C++ logic.
            </p>
          </div>
        </div>

        {/* Game Table */}
        <div
          className="relative rounded-xl p-6 md:p-10 mb-12"
          style={{
            background:
              "linear-gradient(180deg, #0d1829 0%, #111d32 50%, #0d1829 100%)",
            boxShadow:
              "0 0 0 1px rgba(255,255,255,0.06), 0 20px 60px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.03)",
          }}
        >
          {/* Felt texture overlay */}
          <div
            className="absolute inset-0 rounded-xl opacity-[0.03] pointer-events-none"
            style={{
              backgroundImage:
                "radial-gradient(circle at 50% 50%, rgba(45,212,191,0.15) 0%, transparent 70%)",
            }}
          />

          {/* Dealer Section */}
          <div className="relative mb-10">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                Dealer
              </span>
              <div className="h-px bg-white/5 flex-1" />
              <AnimatePresence mode="wait">
                {showDealerCards ? (
                  <motion.span
                    key="dealer-score"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-sm font-mono text-white/80"
                  >
                    {dealerScore}
                  </motion.span>
                ) : (
                  <span className="text-sm font-mono text-muted-foreground/50">
                    ?
                  </span>
                )}
              </AnimatePresence>
            </div>

            <div className="flex gap-2 sm:gap-3 flex-wrap">
              {game.dealerHand.map((cardId, i) => (
                <PlayingCard
                  key={`dealer-${gameNum}-${i}`}
                  cardId={cardId}
                  faceDown={!showDealerCards && i === 0}
                  index={i}
                />
              ))}
            </div>
          </div>

          {/* Result Banner */}
          <AnimatePresence>
            {isOver && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center py-6"
              >
                <span
                  className={`text-2xl md:text-3xl font-serif font-bold ${resultConfig[game.result as Exclude<GameResult, "playing">]?.color}`}
                >
                  {
                    resultConfig[
                      game.result as Exclude<GameResult, "playing">
                    ]?.label
                  }
                </span>
                <span className="text-xs font-mono text-muted-foreground mt-2">
                  {playerScore} vs {dealerScore}
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="h-px bg-white/5 flex-1" />
            <div className="w-1.5 h-1.5 rounded-full bg-primary/30" />
            <div className="h-px bg-white/5 flex-1" />
          </div>

          {/* Player Section */}
          <div className="relative">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-xs font-mono uppercase tracking-wider text-white/70">
                Your Hand
              </span>
              <div className="h-px bg-white/5 flex-1" />
              <span className="text-sm font-mono text-white">
                {playerScore}
              </span>
            </div>

            <div className="flex gap-2 sm:gap-3 flex-wrap mb-8">
              {game.playerHand.map((cardId, i) => (
                <PlayingCard
                  key={`player-${gameNum}-${i}`}
                  cardId={cardId}
                  index={i}
                />
              ))}
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              {!isOver ? (
                <>
                  <Button
                    onClick={hit}
                    className="bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-8 rounded-none font-medium text-sm"
                  >
                    Hit
                  </Button>
                  <Button
                    onClick={stay}
                    variant="outline"
                    className="border-border text-foreground hover:bg-white/5 h-11 px-8 rounded-none text-sm"
                  >
                    Stay
                  </Button>
                </>
              ) : (
                <Button
                  onClick={newGame}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-8 rounded-none font-medium text-sm"
                >
                  <RotateCcw size={14} className="mr-2" /> Deal Again
                </Button>
              )}
            </div>
          </div>

          {/* Game counter */}
          <div className="absolute top-4 right-4 text-[10px] font-mono text-muted-foreground/40">
            #{gameNum}
          </div>
        </div>

        {/* Under the Hood */}
        <Collapsible open={hoodOpen} onOpenChange={setHoodOpen}>
          <CollapsibleTrigger className="w-full">
            <div className="flex items-center gap-4 py-4 border-t border-border group cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="w-[3px] h-5 bg-primary rounded-full" />
                <h2 className="text-lg font-serif text-white/90">
                  Under the Hood
                </h2>
              </div>
              <div className="h-px bg-border flex-1" />
              <ChevronDown
                size={16}
                className={`text-muted-foreground transition-transform duration-300 ${hoodOpen ? "rotate-180" : ""}`}
              />
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="space-y-8 pb-8">
              <p className="text-sm text-muted-foreground leading-relaxed">
                Direct ports from the original CSCI 103 C++ submission. The
                Fisher-Yates shuffle ensures true random permutation, and the
                Ace logic handles soft/hard hand transitions without lookahead.
              </p>

              {/* Fisher-Yates */}
              <div>
                <h3 className="text-sm font-mono text-primary mb-3">
                  shuffle — Fisher-Yates (Durstenfeld) Algorithm
                </h3>
                <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
                  Iterates from the last index (51) down to 1. At each step, it
                  picks a random index in [0, i] and swaps. This produces a
                  uniformly random permutation in O(n) time — every possible
                  ordering of the deck is equally likely.
                </p>
                <div className="rounded-lg overflow-hidden border border-[#334155] bg-[#0F172A]">
                  <div className="bg-[#1E293B] px-4 py-2 text-xs font-mono text-muted-foreground border-b border-[#334155]">
                    project1.cpp — shuffle()
                  </div>
                  <pre className="p-4 font-mono text-xs text-[#E2E8F0] overflow-x-auto leading-relaxed">
                    <code>{`void shuffle(int cards[])
{
    for (int i = NUM_CARDS - 1; i > 0; i--) {
        int j = rand() % (i + 1);
        int temp = cards[j];
        cards[j] = cards[i];
        cards[i] = temp;
    }
}`}</code>
                  </pre>
                </div>
              </div>

              {/* getBestScore */}
              <div>
                <h3 className="text-sm font-mono text-primary mb-3">
                  getBestScore — Soft/Hard Ace Logic
                </h3>
                <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
                  Aces start as 11. After summing all card values, if the total
                  exceeds 21 and there are aces in the hand, it converts aces
                  from 11 to 1 (subtracting 10) one at a time until the total is
                  21 or under, or all aces have been reduced. This is the
                  standard soft/hard hand distinction in Blackjack.
                </p>
                <div className="rounded-lg overflow-hidden border border-[#334155] bg-[#0F172A]">
                  <div className="bg-[#1E293B] px-4 py-2 text-xs font-mono text-muted-foreground border-b border-[#334155]">
                    project1.cpp — getBestScore()
                  </div>
                  <pre className="p-4 font-mono text-xs text-[#E2E8F0] overflow-x-auto leading-relaxed">
                    <code>{`int getBestScore(int hand[], int numCards)
{
    int totalScore = 0;
    int numAces = 0;

    for (int i = 0; i < numCards; i++) {
        int addedValue = cardValue(hand[i]);
        if (addedValue == 11) {
            numAces++;
        }
        totalScore += addedValue;
    }

    while (totalScore > 21 && numAces > 0) {
        totalScore -= 10;
        numAces--;
    }

    return totalScore;
}`}</code>
                  </pre>
                </div>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  );
}
