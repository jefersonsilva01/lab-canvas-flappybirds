window.onload = function () {
  document.getElementById("start-button").onclick = function () {
    startGame();
  };

  const canvas = document.getElementById('my-canvas');
  const context = canvas.getContext('2d');

  const buttonStart = document.getElementById("start-button");

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

      requestAnimationFrame(updateCanvas);
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

      requestAnimationFrame(updatePlayer);
    }

    fabyImage.onload = updatePlayer
  }


  function startGame() {
    buttonStart.setAttribute('disabled', true);
    crateBackgroundCanvas();
    createPlayer();
  }
};
