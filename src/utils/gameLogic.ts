export function checkWinner(board: (string | null)[]): { winner: string | null; line: number[] } {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (const line of lines) {
    const [a, b, c] = line;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a], line };
    }
  }

  return { winner: null, line: [] };
}

export function isBoardFull(board: (string | null)[]): boolean {
  return board.every(cell => cell !== null);
}
