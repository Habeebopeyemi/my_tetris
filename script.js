document.addEventListener("DOMContentLoaded", () => {
  //   alert("js loaded successully");
  const grid = document.querySelector(".grid");
  let squares = Array.from(document.querySelectorAll(".grid div"));
  const scoreBoard = document.querySelector("#score span");
  const start_button = document.querySelector("#start-button");
  const next_shape_display = document.querySelectorAll(".mini-grid div");
  const lines_cleared = document.querySelector("#lines-cleared span");
  const next_shape_width = 4;
  let next_random_index = 0;
  const width = 10;
  const hard_drop_width = 20;
  let score = 0;
  let lines = 0;
  let timerId;
  // console.log(squares);
  const colors = ["orange", "red", "purple", "yellow", "cyan"];
  const lTetromino = [
    [1, width + 1, width * 2 + 1, 2],
    [width, width + 1, width + 2, width * 2 + 2],
    [1, width + 1, width * 2 + 1, width * 2],
    [width, width * 2, width * 2 + 1, width * 2 + 2],
  ];

  const zTetromino = [
    [0, width, width + 1, width * 2 + 1],
    [width + 1, width + 2, width * 2, width * 2 + 1],
    [0, width, width + 1, width * 2 + 1],
    [width + 1, width + 2, width * 2, width * 2 + 1],
  ];

  const tTetromino = [
    [1, width, width + 1, width + 2],
    [1, width + 1, width + 2, width * 2 + 1],
    [width, width + 1, width + 2, width * 2 + 1],
    [1, width, width + 1, width * 2 + 1],
  ];

  const oTetromino = [
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
  ];

  const iTetromino = [
    [1, width + 1, width * 2 + 1, width * 3 + 1],
    [width, width + 1, width + 2, width + 3],
    [1, width + 1, width * 2 + 1, width * 3 + 1],
    [width, width + 1, width + 2, width + 3],
  ];

  const next_shape = [
    [1, next_shape_width + 1, next_shape_width * 2 + 1, 2],
    [0, next_shape_width, next_shape_width + 1, next_shape_width * 2 + 1],
    [1, next_shape_width, next_shape_width + 1, next_shape_width + 2],
    [0, 1, next_shape_width, next_shape_width + 1],
    [
      1,
      next_shape_width + 1,
      next_shape_width * 2 + 1,
      next_shape_width * 3 + 1,
    ],
  ];

  const blockshapes = [
    lTetromino,
    zTetromino,
    tTetromino,
    oTetromino,
    iTetromino,
  ];

  let startingpos = 4;
  let cur_rotation = 0;
  let next_display_index = 0;

  let random_index = Math.floor(Math.random() * blockshapes.length);
  let current = blockshapes[random_index][cur_rotation];

  document.addEventListener("keyup", controlHandler);

  // timerId = setInterval(moveDown, 1000);

  function controlHandler(e) {
    if (e.keyCode === 37) {
      moveLeft();
      return;
    }
    if (e.keyCode === 38) {
      rotate();
      return;
    }
    if (e.keyCode === 39) {
      moveRight();
      return;
    }
    if (e.keyCode === 40) {
      moveDown();
      return;
    }
    if (e.keyCode === 80) {
      pause();
      return;
    }
    // if (e.keyCode === 32) {
    //   // hardDrop();
    //   return;
    // }
  }

  function createShape() {
    current.forEach(index => {
      squares[startingpos + index].classList.add("tetromino");
      squares[startingpos + index].style.backgroundColor = colors[random_index];
    });
  }
  // createShape()

  function clearShape() {
    current.forEach(index => {
      squares[startingpos + index].classList.remove("tetromino");
      squares[startingpos + index].style.backgroundColor = "";
    });
  }

  function moveDown() {
    clearShape();
    startingpos += width;
    createShape();
    freeze();
  }

  function freeze() {
    if (
      current.some(index =>
        squares[startingpos + index + width].classList.contains("taken")
      )
    ) {
      //   console.log("it contains taken");
      current.forEach(index =>
        squares[startingpos + index].classList.add("taken")
      );
      // trick updating next tetromino and current
      random_index = next_random_index;

      next_random_index = Math.floor(Math.random() * blockshapes.length);
      current = blockshapes[random_index][cur_rotation];
      startingpos = 4;
      createShape();
      displayNextShape();
      addScore();
      gameOver();
    }
  }

  function moveLeft() {
    clearShape();
    const isAtLeftEdge = current.some(
      index => (startingpos + index) % width === 0
    );
    if (!isAtLeftEdge) startingpos -= 1;
    // accounting for vertical space filling
    if (
      current.some(index =>
        blockshapes[startingpos + index].classList.contains("taken")
      )
    ) {
      startingpos += 1;
    }

    createShape();
  }

  function moveRight() {
    clearShape();
    const isAtRightEdge = current.some(
      index => (startingpos + index) % width === 9
    );
    if (!isAtRightEdge) startingpos += 1;
    if (
      current.some(index =>
        blockshapes[startingpos + index].classList.contains("taken")
      )
    ) {
      startingpos -= 1;
    }
    createShape();
  }

  function rotate() {
    clearShape();
    cur_rotation++;

    if (cur_rotation === current.length) cur_rotation = 0;

    current = blockshapes[random_index][cur_rotation];
    createShape();
  }

  function displayNextShape() {
    next_shape_display.forEach(square => {
      square.classList.remove("tetromino");
      square.style.backgroundColor = "";
    });
    next_shape[next_random_index].forEach(index => {
      next_shape_display[next_display_index + index].classList.add("tetromino");
      next_shape_display[next_display_index + index].style.backgroundColor =
        colors[next_random_index];
    });
  }

  start_button.addEventListener("click", () => {
    // console.log(timerId);
    // if (timerId) {
    //   clearInterval(timerId);
    //   timerId = null;
    // } else {
    createShape();
    timerId = setInterval(moveDown, 1000);
    next_random_index = Math.floor(Math.random() * blockshapes.length);
    displayNextShape();
    // }
  });
  function pause() {
    if (timerId) {
      clearInterval(timerId);
      timerId = null;
    }
  }
  function addScore() {
    for (let i = 0; i < 199; i += width) {
      let row = [
        i,
        i + 1,
        i + 2,
        i + 3,
        i + 4,
        i + 5,
        i + 6,
        i + 7,
        i + 8,
        i + 9,
      ];

      if (row.every(index => squares[index].classList.contains("taken"))) {
        score += 100;
        lines += 1;
        scoreBoard.innerHTML = score;
        lines_cleared.innerHTML = lines;
        row.forEach(index => {
          squares[index].classList.remove("taken");
          squares[index].classList.remove("tetromino");
          squares[index].style.backgroundColor = "";
        });

        const squaresRemoved = squares.splice(i, width);
        squares = squaresRemoved.concat(squares);
        squares.forEach(square => grid.appendChild(square));
      }
    }
  }

  function gameOver() {
    if (
      current.some(index =>
        squares[startingpos + index].classList.contains("taken")
      )
    ) {
      pause();
      scoreBoard.innerHTML = "end";
      clearInterval(timerId);
      lines_cleared.innerHTML = "0";
      document.removeEventListener("keyup", controlHandler);
    }
  }
});
