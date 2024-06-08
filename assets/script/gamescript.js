let currentRow = 0;
let currentPosition = 0;
const colors = [
  "bg-yellow-500",
  "bg-purple-500",
  "bg-green-500",
  "bg-red-500",
  "bg-blue-500",
  "bg-gray-100",
];
let code = [];
const rows = 8;
const columns = 4;

function fillCircle(colorClass) {
  const gameBoard = document.getElementById("gameBoard").children;
  const row = gameBoard[currentRow].children[0].children[0].children;
  if (currentPosition < row.length) {
    row[currentPosition].classList.remove("bg-gray-800");
    row[currentPosition].classList.add(colorClass);
    currentPosition++;
    playClickSound();
  }

  if (currentPosition >= row.length) {
    
    document.getElementById("checked").disabled = false;
  }
}

function removeColor(circle) {
  circle.classList.remove(...colors);
  circle.classList.add("bg-gray-800");
  currentPosition = Array.from(circle.parentNode.children).indexOf(circle);
  if(currentPosition<row.length){
  document.getElementById("checked").disabled = true;
  alert("First Fill the All the circle");
  }
}

function startNewGame() {
  const gameBoard = document.getElementById("gameBoard");
  gameBoard.innerHTML = "";

  for (let i = 0; i < rows; i++) {
    const row = document.createElement("div");
    row.classList.add("flex", "flex-col", "gap-2");

    const rowContainer = document.createElement("div");
    rowContainer.classList.add(
      "bg-gray-900",
      "p-2",
      "rounded-lg",
      "flex",
      "justify-between",
      "items-center"
    );

    const circles = document.createElement("div");
    circles.classList.add("grid", "grid-cols-4", "gap-2");

    for (let j = 0; j < columns; j++) {
      const circle = document.createElement("div");
      circle.classList.add("w-8", "h-8", "bg-gray-800", "rounded-full");
      circle.addEventListener("click", () => removeColor(circle));
      circles.appendChild(circle);
    }

    const indicators = document.createElement("div");
    indicators.classList.add("grid", "grid-cols-2", "gap-1");

    for (let k = 0; k < columns; k++) {
      const indicator = document.createElement("div");
      indicator.classList.add("w-4", "h-4", "bg-gray-800", "rounded-full");
      indicators.appendChild(indicator);
    }

    rowContainer.appendChild(circles);
    rowContainer.appendChild(indicators);
    row.appendChild(rowContainer);
    gameBoard.appendChild(row);
  }

  currentRow = 0;
  currentPosition = 0;
  document.getElementById("checked").disabled = true;
  generateCode();
  playSound();
}

function generateCode() {
  const allowDuplicates = document.getElementById("allowDuplicates").checked;
  code = [];
  while (code.length < columns) {
    const color = colors[Math.floor(Math.random() * colors.length)];
    if (allowDuplicates || !code.includes(color)) {
      code.push(color);
    }
  }
  console.log("Code:", code);
}

function checkGuess() {
  const gameBoard = document.getElementById("gameBoard").children;
  const row = gameBoard[currentRow].children[0].children[0].children;

  for (let i = 0; i < row.length; i++) {
    if (row[i].classList.contains("bg-gray-800")) {
      Swal.fire({
        title: "Incomplete Guess",
        text: "Please fill all circles before checking your guess.",
        icon: "warning",
        confirmButtonText: "OK",
      });
      return; 
    }
  }

  const guess = Array.from(row).map((cell) => {
    for (let className of cell.classList) {
      if (className.startsWith("bg-")) {
        return className;
      }
    }
    return null;
  });

  console.log('Current Row:', currentRow);
  console.log('Guess:', guess);

  const indicators =
    gameBoard[currentRow].children[0].children[1].children;

  let blackPegs = 0;
  let whitePegs = 0;
  let codeCopy = [...code];
  let guessCopy = [...guess];

  for (let i = 0; i < guess.length; i++) {
    if (guess[i] === codeCopy[i]) {
      blackPegs++;
      codeCopy[i] = null;
      guessCopy[i] = null;
    }
  }

  for (let i = 0; i < guess.length; i++) {
    if (guessCopy[i]) {
      const index = codeCopy.indexOf(guessCopy[i]);
      if (index !== -1) {
        whitePegs++;
        codeCopy[index] = null;
      }
    }
  }
  console.log("Black Pegs:", blackPegs);
  console.log("White Pegs:", whitePegs);

  for (let i = 0; i < blackPegs; i++) {
    indicators[i].classList.remove("bg-gray-800");
    indicators[i].classList.add("bg-black");
  }
  for (let i = 0; i < whitePegs; i++) {
    indicators[blackPegs + i].classList.remove("bg-gray-800");
    indicators[blackPegs + i].classList.add("bg-white");
  }

  if (blackPegs === columns) {
    Swal.fire({
      title: "Congratulations!",
      text: "You have guessed the correct code!",
      icon: "success",
      confirmButtonText: "Play Again",
    }).then((result) => {
      if (result.isConfirmed) {
        playPlegSound();
        startNewGame();
      }
    });
  } else if (currentRow === rows - 1) {
    Swal.fire({
      title: "Game Over!",
      text: `The correct code was: ${code
        .map((c) => c.split("-")[1])
        .join(", ")}`,
      icon: "error",
      confirmButtonText: "Play Again",
    }).then((result) => {
      if (result.isConfirmed) {
        // looseSound();
        startNewGame();
      }
    });
  } else {
    currentRow++;
    currentPosition = 0;
    document.getElementById("checked").disabled = true;
  }
}
document.addEventListener("DOMContentLoaded", () => {
  startNewGame();
});

function playClickSound() {
  const clickSound = document.getElementById("clickSound");
  clickSound.play();
}

function playSound() {
  const guessSound = document.getElementById("guessSound");
  guessSound.play();
}

function playPlegSound() {
  const PlegSound = document.getElementById("PlegSound");
  PlegSound.play();
}

function looseSound() {
  const LooseSound = document.getElementById("looseSound");
  LooseSound.play();
}

document.getElementById("checked").addEventListener("click", () => {
  if (!document.getElementById("checked").disabled) {
    checkGuess();
    playPlegSound();

  }
});
