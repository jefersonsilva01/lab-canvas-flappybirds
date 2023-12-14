window.onload = function () {
  document.getElementById("start-button").onclick = function () {
    startGame();
  };

  const canvas = document.getElementById('my-canvas');
  const context = canvas.getContext('2d');

  function startGame() {

    // Animation background
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

    // Add Faby player
    const faby = {
      width:,
      height:,
      speedX:,
      speedY:,
      gravity:,
      gravitySpeed:,

      update: function () {

      },

      newPos: function () {

      }
    }

  }
};
