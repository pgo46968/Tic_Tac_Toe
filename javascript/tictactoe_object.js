// tictactoe_object.js
// Classe responsável pela lógica de negócio e regras do jogo (O 'Model')

class TicTacToe {
  constructor() {
    this.board = Array(9).fill(null);
    this.currentPlayer = "X";
    this.winner = null;
    this.winningLine = null; // NOVO: Guarda os índices da linha vencedora
    this.gameMode = "2P";
    this.winningCombinations = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
  }

  setMode(mode) {
    this.gameMode = mode;
    this.reset();
  }

  // Retorna os índices de todas as células que ainda estão vazias
  getAvailableMoves() {
    return this.board
      .map((cell, index) => (cell === null ? index : null))
      .filter((val) => val !== null);
  }

  // Executa a jogada do PC
  // Substitui o teu playPC atual por este:
  playPC() {
    const available = this.getAvailableMoves();
    if (available.length === 0 || this.winner !== null) return false;

    let bestScore = -Infinity;
    let move;

    // O PC ('O') testa cada posição vazia
    for (let i = 0; i < available.length; i++) {
      let index = available[i];
      this.board[index] = "O"; // Simula a jogada

      // Chama o minimax para avaliar quão boa é esta jogada
      let score = this.minimax(this.board, 0, false);

      this.board[index] = null; // Desfaz a simulação

      if (score > bestScore) {
        bestScore = score;
        move = index;
      }
    }

    // Executa a melhor jogada encontrada
    return this.play(move);
  }

  // NOVO: Algoritmo Minimax
  minimax(board, depth, isMaximizing) {
    let result = this.checkWinnerSimulated();

    // Avalia o resultado da simulação
    if (result === "O") return 10 - depth; // PC ganha (subtrai a profundidade para preferir vitórias rápidas)
    if (result === "X") return -10 + depth; // Jogador ganha (penaliza derrotas)
    if (result === "Draw") return 0; // Empate

    if (isMaximizing) {
      let bestScore = -Infinity;
      for (let i = 0; i < board.length; i++) {
        if (board[i] === null) {
          board[i] = "O";
          let score = this.minimax(board, depth + 1, false);
          board[i] = null;
          bestScore = Math.max(score, bestScore);
        }
      }
      return bestScore;
    } else {
      let bestScore = Infinity;
      for (let i = 0; i < board.length; i++) {
        if (board[i] === null) {
          board[i] = "X";
          let score = this.minimax(board, depth + 1, true);
          board[i] = null;
          bestScore = Math.min(score, bestScore);
        }
      }
      return bestScore;
    }
  }

  // NOVO: Verifica quem ganha na simulação sem alterar o estado real do jogo ou a interface
  checkWinnerSimulated() {
    for (let combo of this.winningCombinations) {
      const [a, b, c] = combo;
      if (
        this.board[a] &&
        this.board[a] === this.board[b] &&
        this.board[a] === this.board[c]
      ) {
        return this.board[a];
      }
    }
    if (!this.board.includes(null)) return "Draw";
    return null;
  }

  play(index) {
    if (this.board[index] !== null || this.winner !== null) return false;

    this.board[index] = this.currentPlayer;
    this.checkWinner();

    if (!this.winner) {
      this.currentPlayer = this.currentPlayer === "X" ? "O" : "X";
    }
    return true;
  }

  checkWinner() {
    for (let combo of this.winningCombinations) {
      const [a, b, c] = combo;
      if (
        this.board[a] &&
        this.board[a] === this.board[b] &&
        this.board[a] === this.board[c]
      ) {
        this.winner = this.board[a];
        this.winningLine = combo; // NOVO: Regista o [a, b, c] que venceu
        return;
      }
    }
    if (!this.board.includes(null)) {
      this.winner = "Draw";
      this.winningLine = null;
    }
  }

  reset() {
    this.board = Array(9).fill(null);
    this.currentPlayer = "X";
    this.winner = null;
    this.winningLine = null; // NOVO: Limpa a linha vencedora ao reiniciar
  }
}
