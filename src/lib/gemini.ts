import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export async function getBotMove(board: (string | null)[], botSymbol: string, playerSymbol: string): Promise<number> {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const boardStr = board.map((cell, idx) => cell || idx).join(', ');

  const prompt = `You are playing Tic Tac Toe. The current board state is: [${boardStr}]

Your symbol is "${botSymbol}" and the opponent's symbol is "${playerSymbol}".
Empty cells are represented by their index number (0-8).

Return ONLY a single number (0-8) representing the best position to play. Choose strategically:
1. Win if possible
2. Block opponent from winning
3. Take center (4) if available
4. Take corners if available
5. Take sides as last resort

Return only the number, nothing else.`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text().trim();
    const position = parseInt(text);

    if (isNaN(position) || position < 0 || position > 8 || board[position] !== null) {
      const availablePositions = board
        .map((cell, idx) => cell === null ? idx : -1)
        .filter(idx => idx !== -1);
      return availablePositions[Math.floor(Math.random() * availablePositions.length)];
    }

    return position;
  } catch (error) {
    console.error("Gemini API error:", error);
    const availablePositions = board
      .map((cell, idx) => cell === null ? idx : -1)
      .filter(idx => idx !== -1);
    return availablePositions[Math.floor(Math.random() * availablePositions.length)];
  }
}
