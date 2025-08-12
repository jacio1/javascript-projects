const gameInfo = document.querySelector(".game-info");
const actionBtn = document.querySelector(".action-btn");
const container = document.querySelector(".container");

const generateRandomNumber = () => Math.ceil(Math.random() * 6);

actionBtn.addEventListener("click", () => {
  render();
});

const render = () => {
  const player1 = generateRandomNumber();
  const player2 = generateRandomNumber();

  container.innerHTML = "";
  container.insertAdjacentHTML(
    "beforeend",
    `
    <div>
    <h1 style="color: #e98b8b; margin-bottom: 20px">Игрок 1 бросил: ${player1}</h1>
    <img src="./images/dice-player1/dice-${player1}.svg" /></div>`
  );
  container.insertAdjacentHTML(
    "beforeend",
    `
    <div><h1 style="color: #449fcc; margin-bottom: 20px">Игрок 2 бросил: ${player2}</h1>
    <img src="./images/dice-player2/dice-${player2}.svg"/></div>`
  );

  if (player1 === player2) {
    gameInfo.textContent = "Ничья!";
    gameInfo.style.color = "#e1e1e1";
  } else if (player1 > player2) {
    gameInfo.textContent = "Победил игрок 1";
    gameInfo.style.color = "#e98b8b";
  } else {
    gameInfo.textContent = "Победил игрок 2";
    gameInfo.style.color = "#449fcc";
  }
};

render();
