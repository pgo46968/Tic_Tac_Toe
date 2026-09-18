// tictactoe_manager.js
// Responsável pela interação com o DOM, eventos e atualização da interface (O 'Controller' / 'View')

document.addEventListener("DOMContentLoaded", () => {
  const game = new TicTacToe();
  const cells = document.querySelectorAll(".cell");
  const statusText = document.getElementById("status");
  const resetButton = document.getElementById("reset");

  // Novos elementos do DOM
  const btn2P = document.getElementById("mode-2p");
  const btnPC = document.getElementById("mode-pc");
  const boardElement = document.querySelector(".board");

  function updateBoard() {
    cells.forEach((cell, index) => {
      cell.textContent = game.board[index] || "";
      // NOVO: Adiciona 'win' à lista de classes a remover a cada atualização
      cell.classList.remove("x", "o", "win");

      if (game.board[index]) {
        cell.classList.add(game.board[index].toLowerCase());
      }
    });

    if (game.winner) {
      if (game.winner === "Draw") {
        statusText.textContent = "The game ended in a draw.!";
      } else {
        statusText.textContent = `The player ${game.winner} won! 🎉`;

        // NOVO: Aplica a classe .win apenas às 3 células da linha vencedora
        if (game.winningLine) {
          game.winningLine.forEach((index) => {
            cells[index].classList.add("win");
          });
        }
      }
    } else {
      statusText.textContent = `It's the turn of player ${game.currentPlayer}`;
    }
  }

  // Gestão dos botões de Modo
  function changeMode(mode, activeBtn, inactiveBtn) {
    game.setMode(mode);
    activeBtn.style.opacity = "1";
    inactiveBtn.style.opacity = "0.6";
    updateBoard();
  }

  btn2P.addEventListener("click", () => changeMode("2P", btn2P, btnPC));
  btnPC.addEventListener("click", () => changeMode("PC", btnPC, btn2P));

  // Estado inicial visual dos botões
  btnPC.style.opacity = "0.6";

  function handleInteraction(e) {
    if (e.type === "touchstart") e.preventDefault();

    const index = e.target.dataset.index;

    // Se a jogada do humano for válida
    if (index !== undefined && game.play(parseInt(index, 10))) {
      updateBoard();

      // Verifica se está no modo PC, se o jogo não acabou, e se é a vez do 'O'
      if (
        game.gameMode === "PC" &&
        !game.winner &&
        game.currentPlayer === "O"
      ) {
        // Desativa a board para o jogador não clicar enquanto o PC "pensa"
        boardElement.style.pointerEvents = "none";
        statusText.textContent = "The PC is thinking...";

        setTimeout(() => {
          game.playPC();
          updateBoard();
          // Reativa a board
          boardElement.style.pointerEvents = "auto";
        }, 600); // 600ms de delay
      }
    }
  }

  cells.forEach((cell) => {
    cell.addEventListener("click", handleInteraction);
    cell.addEventListener("touchstart", handleInteraction, { passive: false });
  });

  function handleReset(e) {
    if (e.type === "touchstart") e.preventDefault();
    game.reset();
    updateBoard();
  }

  resetButton.addEventListener("click", handleReset);
  resetButton.addEventListener("touchstart", handleReset, { passive: false });

  updateBoard();
});
