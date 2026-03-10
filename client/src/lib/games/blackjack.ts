/**
 * Blackjack (Twenty-One) — Pure game logic ported from project1.cpp
 * Original: CSCI 103, USC — Mazen Abouelela
 */

export const NUM_CARDS = 52;

// Look-up tables — direct port from C++
const suitSymbols = ["\u2665", "\u2660", "\u2666", "\u2663"]; // ♥ ♠ ♦ ♣
const typeLabels = [
  "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A",
];
const values = [2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10, 11];

// ---- card helpers ----

export function getSuitIndex(id: number): number {
  return Math.floor(id / 13);
}

export function getTypeIndex(id: number): number {
  return id % 13;
}

export function getSuitSymbol(id: number): string {
  return suitSymbols[getSuitIndex(id)];
}

export function getTypeLabel(id: number): string {
  return typeLabels[getTypeIndex(id)];
}

export function getSuitColor(id: number): "red" | "black" {
  const suit = getSuitIndex(id);
  return suit === 0 || suit === 2 ? "red" : "black";
}

/**
 * Returns the base value of a card.
 * Aces return 11 — adjusted later by getBestScore.
 */
export function cardValue(id: number): number {
  return values[id % 13];
}

// ---- deck operations ----

export function createDeck(): number[] {
  return Array.from({ length: NUM_CARDS }, (_, i) => i);
}

/**
 * Fisher-Yates / Durstenfeld shuffle — exact port.
 * Iterates from 51 down to 1, swapping with random index in [0, i].
 */
export function shuffleDeck(cards: number[]): number[] {
  const shuffled = [...cards];
  for (let i = NUM_CARDS - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = shuffled[j];
    shuffled[j] = shuffled[i];
    shuffled[i] = temp;
  }
  return shuffled;
}

// ---- scoring ----

/**
 * Best score with soft/hard Ace logic — exact port of getBestScore.
 * Sum all card values. While total > 21 and aces remain, subtract 10.
 */
export function getBestScore(hand: number[]): number {
  let totalScore = 0;
  let numAces = 0;

  for (let i = 0; i < hand.length; i++) {
    const addedValue = cardValue(hand[i]);
    if (addedValue === 11) {
      numAces++;
    }
    totalScore += addedValue;
  }

  while (totalScore > 21 && numAces > 0) {
    totalScore -= 10;
    numAces--;
  }

  return totalScore;
}

// ---- dealer AI ----

export function shouldDealerHit(dealerHand: number[]): boolean {
  return getBestScore(dealerHand) < 17;
}

// ---- game state ----

export type GameResult =
  | "playing"
  | "player_bust"
  | "dealer_bust"
  | "player_win"
  | "dealer_win"
  | "push"
  | "blackjack";

export interface BlackjackState {
  deck: number[];
  deckIndex: number;
  playerHand: number[];
  dealerHand: number[];
  result: GameResult;
  playerStayed: boolean;
}

export function dealInitialHands(): BlackjackState {
  const deck = shuffleDeck(createDeck());
  let idx = 0;

  const playerHand: number[] = [];
  const dealerHand: number[] = [];

  // Deal: player, dealer, player, dealer (exact order from C++)
  playerHand.push(deck[idx++]);
  dealerHand.push(deck[idx++]);
  playerHand.push(deck[idx++]);
  dealerHand.push(deck[idx++]);

  const state: BlackjackState = {
    deck,
    deckIndex: idx,
    playerHand,
    dealerHand,
    result: "playing",
    playerStayed: false,
  };

  // Check for natural blackjack
  if (getBestScore(playerHand) === 21) {
    return resolveDealerTurn(state);
  }

  return state;
}

export function playerHit(state: BlackjackState): BlackjackState {
  if (state.result !== "playing") return state;

  const newHand = [...state.playerHand, state.deck[state.deckIndex]];
  const next: BlackjackState = {
    ...state,
    playerHand: newHand,
    deckIndex: state.deckIndex + 1,
  };

  const score = getBestScore(newHand);
  if (score > 21) {
    next.result = "player_bust";
  } else if (score === 21) {
    return resolveDealerTurn(next);
  }

  return next;
}

export function playerStay(state: BlackjackState): BlackjackState {
  if (state.result !== "playing") return state;
  return resolveDealerTurn({ ...state, playerStayed: true });
}

function resolveDealerTurn(state: BlackjackState): BlackjackState {
  const next = { ...state, playerStayed: true };
  const dealerHand = [...next.dealerHand];
  let idx = next.deckIndex;

  // Dealer draws until >= 17
  while (getBestScore(dealerHand) < 17) {
    dealerHand.push(next.deck[idx++]);
  }

  next.dealerHand = dealerHand;
  next.deckIndex = idx;

  const playerScore = getBestScore(next.playerHand);
  const dealerScore = getBestScore(dealerHand);

  if (playerScore === 21 && next.playerHand.length === 2) {
    next.result = dealerScore === 21 && dealerHand.length === 2 ? "push" : "blackjack";
  } else if (playerScore > 21) {
    next.result = "player_bust";
  } else if (dealerScore > 21) {
    next.result = "dealer_bust";
  } else if (playerScore > dealerScore) {
    next.result = "player_win";
  } else if (playerScore === dealerScore) {
    next.result = "push";
  } else {
    next.result = "dealer_win";
  }

  return next;
}
