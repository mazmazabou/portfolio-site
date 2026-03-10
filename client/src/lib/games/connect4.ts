/**
 * Connect 4 — Pure game logic ported from c4lib.cpp / c4lib.h
 * Original: CSCI 103, USC — Mazen Abouelela
 *
 * Board is stored row-major: board[row][col], row 0 = bottom.
 */

export enum BoardValue {
  BLANK = 0,
  RED = 1,
  YELLOW = 2,
}

export type Board = BoardValue[][];

// ---- board helpers ----

export function createBoard(rows: number, cols: number): Board {
  return Array.from({ length: rows }, () => Array(cols).fill(BoardValue.BLANK));
}

/**
 * Returns the lowest BLANK row in a column, or -1 if full.
 * Direct port of findYValue from c4lib.cpp.
 */
export function findYValue(board: Board, rows: number, col: number): number {
  for (let i = 0; i < rows; i++) {
    if (board[i][col] === BoardValue.BLANK) {
      return i;
    }
  }
  return -1;
}

/**
 * Drop a piece into a column. Returns the landing row or null if column full.
 */
export function dropPiece(
  board: Board,
  col: number,
  player: BoardValue
): { board: Board; row: number } | null {
  const rows = board.length;
  const row = findYValue(board, rows, col);
  if (row === -1) return null;

  const next = board.map((r) => [...r]);
  next[row][col] = player;
  return { board: next, row };
}

// ---- win / draw ----

const playerToValue: BoardValue[] = [BoardValue.RED, BoardValue.YELLOW];

/**
 * Delta-vector win detection — exact port of hasWon from c4lib.cpp.
 * Checks 4 directions from the last placed piece (sy, sx).
 */
export function hasWon(
  board: Board,
  rows: number,
  cols: number,
  sy: number,
  sx: number,
  currentPlayer: number
): boolean {
  const NDIRS = 4;
  const xDirDelta = [0, +1, -1, +1];
  const yDirDelta = [+1, 0, +1, +1];
  const winningCount = 4;
  const playerPiece = playerToValue[currentPlayer];

  for (let dir = 0; dir < NDIRS; dir++) {
    let count = 1;

    // positive direction
    for (let i = 1; i < winningCount; i++) {
      const nx = sx + i * xDirDelta[dir];
      const ny = sy + i * yDirDelta[dir];

      if (
        nx >= 0 &&
        nx < cols &&
        ny >= 0 &&
        ny < rows &&
        board[ny][nx] === playerPiece
      ) {
        count++;
        if (count === winningCount) return true;
      } else {
        break;
      }
    }

    // negative direction
    for (let i = 1; i < winningCount; i++) {
      const nx = sx - i * xDirDelta[dir];
      const ny = sy - i * yDirDelta[dir];

      if (
        nx < cols &&
        nx >= 0 &&
        ny < rows &&
        ny >= 0 &&
        board[ny][nx] === playerPiece
      ) {
        count++;
        if (count === winningCount) return true;
      } else {
        break;
      }
    }
  }

  return false;
}

/**
 * Board-full draw check — exact port of isDraw from c4lib.cpp.
 */
export function isDraw(board: Board, rows: number, cols: number): boolean {
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if (board[i][j] === BoardValue.BLANK) return false;
    }
  }
  return true;
}

// ---- AI (3-priority rule system) ----

/**
 * Get the winning cells for highlighting.
 * Returns array of [row, col] pairs or empty array.
 */
export function getWinningCells(
  board: Board,
  rows: number,
  cols: number,
  sy: number,
  sx: number,
  currentPlayer: number
): [number, number][] {
  const NDIRS = 4;
  const xDirDelta = [0, +1, -1, +1];
  const yDirDelta = [+1, 0, +1, +1];
  const winningCount = 4;
  const playerPiece = playerToValue[currentPlayer];

  for (let dir = 0; dir < NDIRS; dir++) {
    const cells: [number, number][] = [[sy, sx]];

    for (let i = 1; i < winningCount; i++) {
      const nx = sx + i * xDirDelta[dir];
      const ny = sy + i * yDirDelta[dir];
      if (
        nx >= 0 &&
        nx < cols &&
        ny >= 0 &&
        ny < rows &&
        board[ny][nx] === playerPiece
      ) {
        cells.push([ny, nx]);
      } else {
        break;
      }
    }

    for (let i = 1; i < winningCount; i++) {
      const nx = sx - i * xDirDelta[dir];
      const ny = sy - i * yDirDelta[dir];
      if (
        nx >= 0 &&
        nx < cols &&
        ny >= 0 &&
        ny < rows &&
        board[ny][nx] === playerPiece
      ) {
        cells.push([ny, nx]);
      } else {
        break;
      }
    }

    if (cells.length >= winningCount) return cells;
  }

  return [];
}

/**
 * AI move selection — exact port of getUserAIInput from c4lib.cpp.
 *
 * Three-priority system:
 *   1. Block opponent from winning
 *   2. Take winning move for self
 *   3. Fallback: first available column
 *
 * NOTE: The original C++ code checks block FIRST (priority 1), then
 * checks win for self (priority 2). This means the AI will sometimes
 * block instead of winning. This is ported exactly as written.
 */
export function getAIMove(
  board: Board,
  rows: number,
  cols: number,
  currentPlayer: number
): number {
  const currentPiece = playerToValue[currentPlayer];
  const opponentPlayer = 1 - currentPlayer;
  const opponentPiece = playerToValue[opponentPlayer];

  // Priority 1: block opponent from winning
  for (let j = 0; j < cols; j++) {
    const possibleY = findYValue(board, rows, j);
    if (possibleY !== -1) {
      board[possibleY][j] = opponentPiece;
      if (hasWon(board, rows, cols, possibleY, j, opponentPlayer)) {
        board[possibleY][j] = BoardValue.BLANK;
        return j;
      }
      board[possibleY][j] = BoardValue.BLANK;
    }
  }

  // Priority 2: take winning move for self
  for (let j = 0; j < cols; j++) {
    const possibleY = findYValue(board, rows, j);
    if (possibleY !== -1) {
      board[possibleY][j] = currentPiece;
      if (hasWon(board, rows, cols, possibleY, j, currentPlayer)) {
        board[possibleY][j] = BoardValue.BLANK;
        return j;
      }
      board[possibleY][j] = BoardValue.BLANK;
    }
  }

  // Priority 3: fallback to first available column
  for (let j = 0; j < cols; j++) {
    const possibleY = findYValue(board, rows, j);
    if (possibleY !== -1) return j;
  }

  return -1; // no move possible (draw)
}
