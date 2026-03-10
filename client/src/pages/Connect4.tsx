import { useState, useCallback, useEffect, useRef } from "react";
import { Link } from "wouter";
import { ArrowLeft, RotateCcw, ChevronDown, Cpu } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  BoardValue,
  createBoard,
  dropPiece,
  hasWon,
  isDraw,
  getAIMove,
  getWinningCells,
  findYValue,
  type Board,
} from "@/lib/games/connect4";

const ROWS = 6;
const COLS = 7;

type GameStatus =
  | "player_turn"
  | "ai_thinking"
  | "player_win"
  | "ai_win"
  | "draw";

export default function Connect4() {
  const [board, setBoard] = useState<Board>(() => createBoard(ROWS, COLS));
  const [status, setStatus] = useState<GameStatus>("player_turn");
  const [hoverCol, setHoverCol] = useState<number | null>(null);
  const [moves, setMoves] = useState(0);
  const [gameNum, setGameNum] = useState(1);
  const [winCells, setWinCells] = useState<[number, number][]>([]);
  const [lastDrop, setLastDrop] = useState<{
    row: number;
    col: number;
  } | null>(null);
  const [hoodOpen, setHoodOpen] = useState(false);

  const boardRef = useRef(board);
  boardRef.current = board;

  const isGameOver =
    status === "player_win" || status === "ai_win" || status === "draw";

  const resetGame = useCallback(() => {
    setBoard(createBoard(ROWS, COLS));
    setStatus("player_turn");
    setHoverCol(null);
    setMoves(0);
    setWinCells([]);
    setLastDrop(null);
    setGameNum((n) => n + 1);
  }, []);

  // Player = RED (0), AI = YELLOW (1)
  const handleColumnClick = useCallback(
    (col: number) => {
      if (status !== "player_turn") return;

      const result = dropPiece(board, col, BoardValue.RED);
      if (!result) return;

      const { board: newBoard, row } = result;
      setBoard(newBoard);
      setLastDrop({ row, col });
      setMoves((m) => m + 1);

      if (hasWon(newBoard, ROWS, COLS, row, col, 0)) {
        const cells = getWinningCells(newBoard, ROWS, COLS, row, col, 0);
        setWinCells(cells);
        setStatus("player_win");
        return;
      }
      if (isDraw(newBoard, ROWS, COLS)) {
        setStatus("draw");
        return;
      }

      setStatus("ai_thinking");
    },
    [board, status]
  );

  // AI turn
  useEffect(() => {
    if (status !== "ai_thinking") return;

    const timer = setTimeout(() => {
      const currentBoard = boardRef.current;
      // Work on a mutable copy for the AI's simulation
      const boardCopy = currentBoard.map((r) => [...r]);
      const aiCol = getAIMove(boardCopy, ROWS, COLS, 1);
      if (aiCol === -1) {
        setStatus("draw");
        return;
      }

      const result = dropPiece(currentBoard, aiCol, BoardValue.YELLOW);
      if (!result) {
        setStatus("draw");
        return;
      }

      const { board: newBoard, row } = result;
      setBoard(newBoard);
      setLastDrop({ row, col: aiCol });
      setMoves((m) => m + 1);

      if (hasWon(newBoard, ROWS, COLS, row, aiCol, 1)) {
        const cells = getWinningCells(newBoard, ROWS, COLS, row, aiCol, 1);
        setWinCells(cells);
        setStatus("ai_win");
        return;
      }
      if (isDraw(newBoard, ROWS, COLS)) {
        setStatus("draw");
        return;
      }

      setStatus("player_turn");
    }, 400);

    return () => clearTimeout(timer);
  }, [status]);

  const getGhostRow = (col: number): number => {
    return findYValue(board, ROWS, col);
  };

  const isWinCell = (row: number, col: number): boolean => {
    return winCells.some(([r, c]) => r === row && c === col);
  };

  const statusText = {
    player_turn: "Your turn",
    ai_thinking: "AI is thinking\u2026",
    player_win: "You win!",
    ai_win: "AI wins!",
    draw: "Draw!",
  };

  const statusColor = {
    player_turn: "text-red-400",
    ai_thinking: "text-yellow-400",
    player_win: "text-primary",
    ai_win: "text-yellow-400",
    draw: "text-muted-foreground",
  };

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
                Connect 4
              </h1>
            </div>
            <span className="text-[10px] uppercase tracking-wider px-2 py-1 bg-primary/10 text-primary border border-primary/20 rounded shrink-0 w-fit h-fit">
              C++ &middot; Playable Demo
            </span>
          </div>

          <div className="flex flex-wrap gap-2 mb-8">
            {[
              "C++",
              "Game AI",
              "Dynamic Memory",
              "Win Detection",
              "Delta Vectors",
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
              A terminal-based Connect 4 game ported from C++ to the browser.
              The AI uses a three-priority rule system: first it scans for
              blocking moves, then winning moves, then falls back to positional
              play. No minimax, no search trees — just clean
              conditional logic. You play as Red.
            </p>
          </div>
        </div>

        {/* Game Area */}
        <div className="flex flex-col items-center mb-12">
          {/* Status Bar */}
          <div className="w-full max-w-[490px] flex items-center justify-between mb-6 px-1">
            <div className="flex items-center gap-3">
              <div
                className={`w-4 h-4 rounded-full ${
                  status === "player_turn" || status === "player_win"
                    ? "bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.5)]"
                    : status === "ai_thinking" || status === "ai_win"
                      ? "bg-yellow-400 shadow-[0_0_12px_rgba(234,179,8,0.5)]"
                      : "bg-muted-foreground"
                }`}
              />
              <span
                className={`text-sm font-mono font-medium ${statusColor[status]}`}
              >
                {statusText[status]}
              </span>
              {status === "ai_thinking" && (
                <Cpu
                  size={14}
                  className="text-yellow-400 animate-pulse"
                />
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={resetGame}
              className="text-xs text-muted-foreground hover:text-white gap-1.5"
            >
              <RotateCcw size={12} /> New Game
            </Button>
          </div>

          {/* Column Hover Indicators */}
          <div
            className="grid gap-1 mb-1 max-w-[490px] w-full"
            style={{ gridTemplateColumns: `repeat(${COLS}, 1fr)` }}
          >
            {Array.from({ length: COLS }).map((_, col) => {
              const isActive =
                hoverCol === col &&
                status === "player_turn" &&
                findYValue(board, ROWS, col) !== -1;
              return (
                <div
                  key={col}
                  className="flex justify-center h-6"
                >
                  <motion.div
                    className="w-5 h-5 rounded-full bg-red-500/30"
                    initial={{ opacity: 0, y: -8 }}
                    animate={{
                      opacity: isActive ? 1 : 0,
                      y: isActive ? 0 : -8,
                    }}
                    transition={{ duration: 0.15 }}
                  />
                </div>
              );
            })}
          </div>

          {/* Board */}
          <div
            className="relative rounded-xl p-2 md:p-3 max-w-[490px] w-full"
            style={{
              background:
                "linear-gradient(180deg, #1a2744 0%, #162036 100%)",
              boxShadow:
                "0 0 0 1px rgba(255,255,255,0.06), 0 20px 60px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.04)",
            }}
          >
            <div
              className="grid gap-1"
              style={{ gridTemplateColumns: `repeat(${COLS}, 1fr)` }}
            >
              {/* Render top-to-bottom (row 5 = top) */}
              {Array.from({ length: ROWS }).map((_, rowIdx) => {
                const row = ROWS - 1 - rowIdx;
                return Array.from({ length: COLS }).map((_, col) => {
                  const cell = board[row][col];
                  const ghostRow = getGhostRow(col);
                  const showGhost =
                    cell === BoardValue.BLANK &&
                    hoverCol === col &&
                    row === ghostRow &&
                    status === "player_turn";
                  const isAnimating =
                    lastDrop?.row === row && lastDrop?.col === col;
                  const isWin = isWinCell(row, col);

                  return (
                    <div
                      key={`${row}-${col}`}
                      className="relative aspect-square flex items-center justify-center cursor-pointer"
                      onClick={() => handleColumnClick(col)}
                      onMouseEnter={() => setHoverCol(col)}
                      onMouseLeave={() => setHoverCol(null)}
                    >
                      {/* Cell background */}
                      <div
                        className="absolute inset-[3px] md:inset-1 rounded-full"
                        style={{
                          background:
                            "radial-gradient(ellipse at 30% 30%, rgba(10,15,28,0.95) 0%, rgba(6,10,20,1) 100%)",
                          boxShadow:
                            "inset 0 2px 6px rgba(0,0,0,0.6), inset 0 -1px 2px rgba(255,255,255,0.03)",
                        }}
                      />

                      {/* Piece */}
                      <AnimatePresence>
                        {cell !== BoardValue.BLANK && (
                          <motion.div
                            key={`piece-${row}-${col}`}
                            className="absolute inset-[5px] md:inset-[6px] rounded-full z-10"
                            initial={
                              isAnimating
                                ? { y: -(row + 1) * 72, opacity: 0.8 }
                                : false
                            }
                            animate={{ y: 0, opacity: 1 }}
                            transition={{
                              type: "spring",
                              stiffness: 300,
                              damping: 20,
                              mass: 0.8,
                            }}
                            style={{
                              background:
                                cell === BoardValue.RED
                                  ? "radial-gradient(ellipse at 35% 30%, #f87171 0%, #ef4444 40%, #b91c1c 100%)"
                                  : "radial-gradient(ellipse at 35% 30%, #fde047 0%, #eab308 40%, #a16207 100%)",
                              boxShadow: isWin
                                ? `0 0 20px 4px ${cell === BoardValue.RED ? "rgba(212,168,83,0.6)" : "rgba(212,168,83,0.6)"}, inset 0 1px 2px rgba(255,255,255,0.3)`
                                : `inset 0 2px 4px rgba(255,255,255,0.25), inset 0 -2px 4px rgba(0,0,0,0.2), 0 2px 4px rgba(0,0,0,0.3)`,
                            }}
                          >
                            {isWin && (
                              <motion.div
                                className="absolute inset-0 rounded-full"
                                animate={{
                                  boxShadow: [
                                    "0 0 8px 2px rgba(212,168,83,0.3)",
                                    "0 0 20px 6px rgba(212,168,83,0.6)",
                                    "0 0 8px 2px rgba(212,168,83,0.3)",
                                  ],
                                }}
                                transition={{
                                  repeat: Infinity,
                                  duration: 1.5,
                                }}
                              />
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Ghost piece */}
                      {showGhost && (
                        <div
                          className="absolute inset-[5px] md:inset-[6px] rounded-full z-10 pointer-events-none"
                          style={{
                            background:
                              "radial-gradient(ellipse at 35% 30%, rgba(248,113,113,0.3) 0%, rgba(239,68,68,0.2) 100%)",
                          }}
                        />
                      )}
                    </div>
                  );
                });
              })}
            </div>
          </div>

          {/* Column numbers */}
          <div
            className="grid gap-1 mt-2 max-w-[490px] w-full"
            style={{ gridTemplateColumns: `repeat(${COLS}, 1fr)` }}
          >
            {Array.from({ length: COLS }).map((_, col) => (
              <div
                key={col}
                className="text-center text-[10px] font-mono text-muted-foreground/50"
              >
                {col + 1}
              </div>
            ))}
          </div>

          {/* Stats */}
          <div className="flex gap-6 mt-6 text-xs font-mono text-muted-foreground">
            <span>Moves: {moves}</span>
            <span>Game #{gameNum}</span>
          </div>

          {/* Game Over Overlay */}
          <AnimatePresence>
            {isGameOver && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6"
              >
                <Button
                  onClick={resetGame}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-6 rounded-none font-medium"
                >
                  <RotateCcw size={14} className="mr-2" /> Play Again
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
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
                The browser version is a direct port of the original C++ code
                from CSCI 103. Below are the two core algorithms — the
                delta-vector win checker and the three-priority AI — exactly as
                they were written.
              </p>

              {/* Win Detection */}
              <div>
                <h3 className="text-sm font-mono text-primary mb-3">
                  hasWon — Delta-Vector Win Detection
                </h3>
                <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
                  Instead of checking every possible 4-in-a-row on the board,
                  this only checks from the last placed piece outward. It uses 4
                  direction vectors — vertical, horizontal, and both
                  diagonals — scanning positive then negative along each axis.
                  If consecutive same-color pieces reach 4 in any direction, it
                  returns true.
                </p>
                <div className="rounded-lg overflow-hidden border border-[#334155] bg-[#0F172A]">
                  <div className="bg-[#1E293B] px-4 py-2 text-xs font-mono text-muted-foreground border-b border-[#334155]">
                    c4lib.cpp — hasWon()
                  </div>
                  <pre className="p-4 font-mono text-xs text-[#E2E8F0] overflow-x-auto leading-relaxed">
                    <code>{`bool hasWon(
    BoardValue** board,
    int ydim, int xdim,
    int sy, int sx,
    int currentPlayer)
{
    const int NDIRS = 4;
    const int xDirDelta[NDIRS] = { 0, +1, -1, +1};
    const int yDirDelta[NDIRS] = {+1,  0, +1, +1};

    const int winningCount = 4;
    BoardValue playerPiece = playerToValue[currentPlayer];

    for (int dir = 0; dir < NDIRS; dir++) {
        int count = 1;

        // positive directions
        for (int i = 1; i < winningCount; i++) {
            int nx = sx + (i * xDirDelta[dir]);
            int ny = sy + (i * yDirDelta[dir]);

            if (nx >= 0 && nx < xdim &&
                ny >= 0 && ny < ydim &&
                board[ny][nx] == playerPiece) {
                count++;
                if (count == winningCount) return true;
            }
            else break;
        }

        // negative directions
        for (int i = 1; i < winningCount; i++) {
            int nx = sx - (i * xDirDelta[dir]);
            int ny = sy - (i * yDirDelta[dir]);

            if (nx < xdim && nx >= 0 &&
                ny < ydim && ny >= 0 &&
                board[ny][nx] == playerPiece) {
                count++;
                if (count == winningCount) return true;
            } else break;
        }
    }
    return false;
}`}</code>
                  </pre>
                </div>
              </div>

              {/* AI */}
              <div>
                <h3 className="text-sm font-mono text-primary mb-3">
                  getUserAIInput — Three-Priority AI
                </h3>
                <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
                  The AI doesn't search ahead or evaluate board
                  positions. It runs three loops in order: (1) check
                  if the opponent can win anywhere — if so, block that column;
                  (2) check if the AI can win anywhere — if so, take it;
                  (3) if neither, drop in the first available column. Simple
                  rule-based play that's surprisingly hard to beat casually.
                </p>
                <div className="rounded-lg overflow-hidden border border-[#334155] bg-[#0F172A]">
                  <div className="bg-[#1E293B] px-4 py-2 text-xs font-mono text-muted-foreground border-b border-[#334155]">
                    c4lib.cpp — getUserAIInput()
                  </div>
                  <pre className="p-4 font-mono text-xs text-[#E2E8F0] overflow-x-auto leading-relaxed">
                    <code>{`bool getUserAIInput(BoardValue** board,
    int ydim, int xdim,
    int *y, int *x, int currentPlayer)
{
    BoardValue currentPlayerPiece = playerToValue[currentPlayer];
    BoardValue opponentPiece = (currentPlayerPiece == RED)
        ? YELLOW : RED;

    // First priority: block opponent from winning
    for (int j = 0; j < xdim; j++) {
        int possibleY = findYValue(board, ydim, j);
        if (possibleY != -1) {
            board[possibleY][j] = opponentPiece;
            if (hasWon(board, ydim, xdim,
                possibleY, j, 1 - currentPlayer)) {
                board[possibleY][j] = BLANK;
                *y = possibleY;
                *x = j;
                board[possibleY][j] = currentPlayerPiece;
                return false; // blocking move made
            }
            board[possibleY][j] = BLANK;
        }
    }

    // Second priority: win if possible
    for (int j = 0; j < xdim; j++) {
        int possibleY = findYValue(board, ydim, j);
        if (possibleY != -1) {
            board[possibleY][j] = opponentPiece;
            if (hasWon(board, ydim, xdim,
                possibleY, j, 1 - currentPlayer)) {
                board[possibleY][j] = currentPlayerPiece;
                *y = possibleY;
                *x = j;
                return false;
            } else {
                board[possibleY][j] = BLANK;
            }
        }
    }

    // Fallback: first available column
    for (int j = 0; j < xdim; j++) {
        int possibleY = findYValue(board, ydim, j);
        if (possibleY != -1) {
            *y = possibleY;
            *x = j;
            board[possibleY][j] = currentPlayerPiece;
            return false;
        }
    }

    return true; // no move possible
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
