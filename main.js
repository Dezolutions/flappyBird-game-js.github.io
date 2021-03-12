//инициализация переменных
let cvs = document.querySelector('.canvas');
let ctx = cvs.getContext('2d');
let body = document.querySelector('body');
let playBtn = document.querySelector('.game-btn');
let gameModal = document.querySelector('.game');
let gameLostModal = document.querySelector('.game__lost');
let gameScore = document.querySelector('.game__lost-score');
let retryBtn = document.querySelector('.game__lost-btn');


//инициализация игровых обьектов
let bird = new Image();
let bg = new Image();
let fg = new Image();
let pipeUp = new Image();
let pipeDown = new Image();

//пути
bird.src = "./img/bird.png";
bg.src = "./img/bg.png";
fg.src = "./img/fg.png";
pipeUp.src = "./img/pipeNorth.png";
pipeDown.src = "./img/pipeSouth.png";
bg.width = 100;
let gap = 100;
let score = 0;



// позиция птички
let xPos = 10;
let yPos = 150;
let gravity = 1.8;

//звуки 
let fly = new Audio();
let scoreAudio = new Audio();

//пути к звукам
fly.src = "./sounds/fly.mp3";
scoreAudio.src = "./sounds/score.mp3";

//птичка подлетает вверх по нажатию на кнопку
const moveUp = () => {
  yPos -= 35;
  fly.play();
}
document.addEventListener('keydown', moveUp);
document.addEventListener('click', moveUp);

//массив для анимации передвижения блоков
let pipe = [];
pipe[0] = {
  x: cvs.clientWidth,
  y: 0
}

//реализация игры
const draw = () => {


  ctx.drawImage(bg, 0, 0);
  let animation = true;
  for (let i = 0; i < pipe.length; i++) {
    //отрисовка блоков
    ctx.drawImage(pipeUp, pipe[i].x, pipe[i].y);
    ctx.drawImage(pipeDown, pipe[i].x, pipe[i].y + pipeUp.height + gap);
    pipe[i].x--;

    //рандомное повяление новых блоков
    if (pipe[i].x === 100) {
      pipe.push({
        x: cvs.clientWidth,
        y: Math.floor(Math.random() * pipeUp.height) - pipeUp.height
      })
    }
    //столкновение птички с обьектами
    if (xPos + bird.width >= pipe[i].x
      && xPos <= pipe[i].x + pipeUp.width
      && (yPos <= pipe[i].y + pipeUp.height || yPos + bird.height >= pipe[i].y + pipeUp.height + gap)
      || yPos + bird.height >= cvs.height - fg.height) {

      animation = false;
      body.style.backgroundColor = 'black';
      gameLostModal.classList.add('block');
      gameScore.innerHTML = `your score: ${score}`;
    }

    //увеличиваем счет при прохождении мимо блоков
    if (pipe[i].x === 5) {
      score++;
      scoreAudio.play();
    }
  }

  //отрисовка остальных элментов
  ctx.drawImage(fg, 0, 0 + cvs.height - fg.height);
  ctx.drawImage(bird, xPos, yPos);

  //счет очков
  ctx.fillStyle = '#000';
  ctx.font = '24px Verdana';
  ctx.fillText(`Score:${score}`, 10, cvs.height - 20)

  //гравитация для птички
  yPos += gravity;
  //условие анимации
  animation ? requestAnimationFrame(draw) : 0
}
//кнопка начать игру
playBtn.onclick = () => {
  cvs.classList.add('block');
  body.style.backgroundColor = "transparent";
  gameModal.classList.add('none');
  draw()
}

//кнопка при поражении, попробовать снова
retryBtn.onclick = () => {
  location.reload();
}
