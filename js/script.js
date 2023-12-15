window.onload = function () {
  document.getElementById("start-button").onclick = function () {
    startGame();
  };

  const canvas = document.getElementById('my-canvas');
  const context = canvas.getContext('2d');

  const buttonStart = document.getElementById("start-button");
  let obstaclesArray = [],
    points = 0,
    playerPositionX,
    playerPositionY,
    animateBg,
    animatePlayer,
    animateObstacles,
    animateScore

  // Animation background
  function crateBackgroundCanvas() {
    const bgImage = new Image();
    bgImage.src = '../images/bg.png';

    canvas.width = bgImage.width;
    canvas.height = bgImage.height;

    const backgroundImage = {
      img: bgImage,
      x: 0,
      speed: -1,
      width: canvas.width,

      move: function () {
        this.x += this.speed;
        this.x %= this.width;
      },

      draw: function () {
        context.drawImage(this.img, this.x, 0);
        if (this.speed < 0) {
          context.drawImage(this.img, this.x + canvas.width, 0);
        } else {
          context.drawImage(this.img, this.x - this.img.width, 0);
        }
      },
    };

    function updateCanvas() {
      backgroundImage.move();

      context.clearRect(0, 0, canvas.width, canvas.height);
      backgroundImage.draw();

      animateBg = requestAnimationFrame(updateCanvas);
    }

    bgImage.onload = updateCanvas;
  }

  // Add Faby player
  function createPlayer() {
    const fabyImage = new Image();
    fabyImage.src = '../images/flappy.png';

    const faby = {
      fabyImg: fabyImage,
      width: canvas.width / 4,
      height: canvas.height / 2,
      speedX: 1,
      speedY: 0,
      gravity: 0,
      gravitySpeed: 0,

      update: function () {
        context.drawImage(this.fabyImg, this.width, this.height, 49, 32);
        playerPositionX = this.width;
        playerPositionY = Math.round(this.height);
      },

      newPos: function () {
        if (this.gravity < 0) {
          this.speedY -= 0.3;
          this.height += this.speedY;
          this.gravitySpeed = 0
        } else if (this.gravity > 0) {
          this.gravitySpeed += 0.3;
          this.height += this.gravitySpeed;
          this.speedY = 0;
        }
      },
    };

    document.onkeydown = e => {
      switch (e.keyCode) {
        case 32:
          faby.gravity = -1;
          break;
      }
    }

    document.onkeyup = e => {
      switch (e.keyCode) {
        case 32:
          faby.gravity = 1;
          break;
      }
    }

    function updatePlayer() {
      faby.update();
      faby.newPos();

      animatePlayer = requestAnimationFrame(updatePlayer);
    }

    fabyImage.onload = updatePlayer
  }

  // Add obstacles
  function obstacles() {
    const obstacleTop = new Image();
    obstacleTop.src = '../images/obstacle_top.png';

    const obstacleBottom = new Image();
    obstacleBottom.src = '../images/obstacle_bottom.png';

    let obstaclesPositionX = 801;

    function createObstacles() {
      for (let i = 0; i < 5; i++) {
        let obstaclesTopPositionY = Math.floor(Math.random() * (-480 - -650) + -650)

        let obstaclesBottomPositionY = obstaclesTopPositionY + obstacleTop.height + Math.floor(Math.random() * (192 - 96) + 96);
        // let obstaclesBottomPositionY = Math.floor(Math.random() * (500 - 350) + 350) - 96;

        // obstacleTop.height = Math.floor(Math.random() * (384 - 120)) + 120 - 96;
        // obstacleBottom.height = 502 - obstacleTop.height - 96;
        // obstacleBottom.height = Math.floor(Math.random() * (252 - 120)) + 120 - 25;
        obstaclesPositionX += Math.floor(Math.random() * (300 - 250)) + 250;

        obstaclesArray.push({
          i: i,
          x: obstaclesPositionX,
          top: obstaclesTopPositionY,
          bottom: obstaclesBottomPositionY,
          imgTop: obstacleTop,
          imgBottom: obstacleBottom,
        });
      };
    }

    function draw() {
      if (!(obstaclesArray.length === 5)) {
        createObstacles();
      } else if (obstaclesArray[4].x < -120) {
        obstaclesArray = [];
        obstaclesPositionX = 601;
        createObstacles();
      }

      obstaclesArray.forEach(obstacle => {
        obstacle.x -= 1;
        context.drawImage(obstacle.imgTop, obstacle.x, obstacle.top);
        context.drawImage(obstacle.imgBottom, obstacle.x, obstacle.bottom);
      })
    }

    function scoreGame() {
      points++;
      context.font = 'bold 25pt Arial'
      context.fillStyle = '#fff';
      context.fillText(`Score: ${points}`, 50, 50);
    }

    function updateObstacles() {
      draw();
      scoreGame();
      animateObstacles = requestAnimationFrame(updateObstacles);
    }

    obstacleBottom.onload = updateObstacles;
  }

  // Draw points endgame
  function drawPoints() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    const bgImage = new Image();
    bgImage.src = '../images/bg.png'
    function draw() {
      context.drawImage(bgImage, 0, 0);
    }

    bgImage.onload = draw;

    setTimeout(() => {
      context.font = 'bold 35pt Arial'
      context.fillStyle = '#fff';
      context.fillText(`GAME OVER, Your score: ${points}`, 150, 150);
    }, 500)
  }

  // Stop game
  function stopGame() {
    cancelAnimationFrame(animateBg);
    cancelAnimationFrame(animatePlayer);
    cancelAnimationFrame(animateObstacles);
    cancelAnimationFrame(animateScore);
    drawPoints();
    buttonStart.removeAttribute('disabled');
    obstaclesArray = [];
  }

  // Check if colision
  function checkIfColision(idCheckColision) {
    obstaclesArray.forEach(obstacles => {
      if (playerPositionX === obstacles.x && (playerPositionY + 15 <= obstacles.top + 793 || playerPositionY + 15 >= obstacles.bottom)) {
        clearInterval(idCheckColision);
        stopGame()
      } else if (playerPositionY < 0 || playerPositionY > canvas.height) {
        clearInterval(idCheckColision);
        stopGame()
      }
    })
  }

  function startGame() {
    context.reset();
    crateBackgroundCanvas();
    obstacles();
    createPlayer();
    const idCheckColision = setInterval(() => {
      checkIfColision(idCheckColision);
    }, 10);
    buttonStart.setAttribute('disabled', true);
  }
};
