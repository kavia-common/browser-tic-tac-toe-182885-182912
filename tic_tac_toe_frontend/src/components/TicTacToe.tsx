import React, { useMemo, useState } from "react";

/**
 * Colors and theme constants for the Ocean Professional style.
 */
const COLORS = {
  primary: "#2563EB",
  secondary: "#F59E0B",
  success: "#F59E0B",
  error: "#EF4444",
  background: "#f9fafb",
  surface: "#ffffff",
  text: "#111827",
  shadow: "rgba(17, 24, 39, 0.08)",
  shadowStrong: "rgba(17, 24, 39, 0.12)",
};

type Player = "X" | "O" | null;

type WinnerResult = {
  winner: Player;
  line: number[] | null;
};

// PUBLIC_INTERFACE
export function TicTacToe() {
  /**
   * Board state modeled as an array of 9 positions (0..8).
   * Each cell holds "X" | "O" | null
   */
  const [board, setBoard] = useState<Player[]>(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState<boolean>(true);
  const [hasStarted, setHasStarted] = useState<boolean>(false);

  /**
   * Compute the winner as a pure function result.
   * Memoized for performance and determinism.
   */
  const { winner, line } = useMemo(() => calculateWinner(board), [board]);

  const isBoardFull = useMemo(() => board.every((c) => c !== null), [board]);
  const isDraw = useMemo(() => !winner && isBoardFull, [winner, isBoardFull]);
  const isGameOver = Boolean(winner) || isDraw;

  // PUBLIC_INTERFACE
  function resetGame(): void {
    setBoard(Array(9).fill(null));
    setXIsNext(true);
    setHasStarted(false);
  }

  function handleClick(index: number) {
    if (isGameOver || board[index] !== null) return;

    const nextBoard = board.slice();
    nextBoard[index] = xIsNext ? "X" : "O";
    setBoard(nextBoard);
    setXIsNext(!xIsNext);
    if (!hasStarted) setHasStarted(true);
  }

  const statusText = (() => {
    if (winner) return `Winner: ${winner}`;
    if (isDraw) return "It's a draw!";
    return `Turn: ${xIsNext ? "X" : "O"}`;
  })();

  const statusColor = (() => {
    if (winner) return winner === "X" ? COLORS.primary : COLORS.secondary;
    if (isDraw) return COLORS.error;
    return COLORS.text;
  })();

  return (
    <div style={styles.appContainer}>
      {/* Subtle gradient background overlay */}
      <div style={styles.backgroundGradient} />

      <div style={styles.card}>
        <div style={styles.header}>
          <h1 style={styles.title}>Tic Tac Toe</h1>
          <p style={{ ...styles.subtitle, color: statusColor }}>{statusText}</p>
        </div>

        <div style={styles.boardWrapper}>
          <div style={styles.board}>
            {board.map((value, idx) => {
              const highlight =
                Boolean(line) && (line as number[]).includes(idx);
              return (
                <button
                  key={idx}
                  onClick={() => handleClick(idx)}
                  aria-label={`Cell ${idx + 1}`}
                  style={{
                    ...styles.cell,
                    ...(value === "X" ? styles.cellX : {}),
                    ...(value === "O" ? styles.cellO : {}),
                    ...(highlight ? styles.cellHighlight : {}),
                  }}
                >
                  <span
                    style={{
                      ...styles.cellValue,
                      color:
                        value === "X"
                          ? COLORS.primary
                          : value === "O"
                          ? COLORS.secondary
                          : COLORS.text,
                    }}
                  >
                    {value}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div style={styles.controls}>
          <button onClick={resetGame} style={styles.resetButton}>
            New Game
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * PUBLIC_INTERFACE
 * A pure function that determines the winner for a tic tac toe board.
 * Returns the winning player and the winning line indices if present.
 */
export function calculateWinner(squares: Player[]): WinnerResult {
  const lines = [
    [0, 1, 2], // rows
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6], // cols
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8], // diags
    [2, 4, 6],
  ];

  for (const [a, b, c] of lines) {
    if (
      squares[a] &&
      squares[a] === squares[b] &&
      squares[a] === squares[c]
    ) {
      return { winner: squares[a], line: [a, b, c] };
    }
  }
  return { winner: null, line: null };
}

// Styles (inline for simplicity; CSS modules could also be used)
const styles: Record<string, React.CSSProperties> = {
  appContainer: {
    minHeight: "100vh",
    width: "100%",
    background: COLORS.background,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    padding: 16,
  },
  backgroundGradient: {
    position: "absolute",
    inset: 0,
    background:
      "linear-gradient(135deg, rgba(37,99,235,0.08) 0%, rgba(249,250,251,0.9) 60%)",
    pointerEvents: "none",
  },
  card: {
    position: "relative",
    zIndex: 1,
    width: "min(92vw, 560px)",
    background: COLORS.surface,
    borderRadius: 16,
    boxShadow: `0 6px 24px ${COLORS.shadow}, 0 2px 8px ${COLORS.shadowStrong}`,
    padding: 24,
    border: "1px solid rgba(17,24,39,0.06)",
    backdropFilter: "saturate(120%) blur(2px)",
  },
  header: {
    textAlign: "center",
    marginBottom: 16,
  },
  title: {
    margin: 0,
    color: COLORS.text,
    fontWeight: 700,
    fontSize: 28,
    letterSpacing: 0.2,
  },
  subtitle: {
    marginTop: 8,
    marginBottom: 0,
    fontSize: 16,
    color: COLORS.text,
  },
  boardWrapper: {
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: 8,
  },
  board: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: 12,
    width: "min(82vw, 420px)",
    // maintain square board: we use min(82vw, 420px) for width; height follows via aspect ratio of cells
  },
  cell: {
    position: "relative",
    width: "100%",
    paddingTop: "100%", // square cell
    borderRadius: 14,
    background: "#ffffff",
    border: "1px solid rgba(17,24,39,0.06)",
    boxShadow: `0 2px 8px ${COLORS.shadow}`,
    cursor: "pointer",
    transition:
      "transform 160ms ease, box-shadow 160ms ease, border-color 160ms ease, background 160ms ease",
    outline: "none",
  },
  cellX: {
    background:
      "linear-gradient(180deg, rgba(37,99,235,0.06), rgba(255,255,255,0.9))",
    borderColor: "rgba(37,99,235,0.25)",
  },
  cellO: {
    background:
      "linear-gradient(180deg, rgba(245,158,11,0.06), rgba(255,255,255,0.9))",
    borderColor: "rgba(245,158,11,0.25)",
  },
  cellHighlight: {
    boxShadow: `0 0 0 3px rgba(37,99,235,0.25), 0 8px 18px ${COLORS.shadow}`,
    transform: "translateY(-2px)",
  },
  cellValue: {
    position: "absolute",
    inset: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 800,
    fontSize: 42,
    userSelect: "none",
    transition: "color 160ms ease",
  },
  controls: {
    marginTop: 18,
    display: "flex",
    justifyContent: "center",
  },
  resetButton: {
    background: COLORS.primary,
    color: "#ffffff",
    border: "none",
    borderRadius: 999,
    padding: "10px 18px",
    fontWeight: 600,
    letterSpacing: 0.2,
    cursor: "pointer",
    boxShadow: `0 4px 14px rgba(37,99,235,0.25)`,
    transition:
      "transform 160ms ease, box-shadow 160ms ease, background-color 160ms ease",
  },
};
