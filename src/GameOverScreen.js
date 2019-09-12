import Phaser, { Scene } from 'phaser';

class GameoverScreen extends Scene {
  constructor() {
    super('gameover');
  }

  // this is where data is carried over from the previous level
  init(data) {
    this.score = data.score;
    this.timeElapsed = data.time;
    // this.time = data.timeElapsed;
  }

  preload() {
  }

  create() {

    const width = this.cameras.main.width;
    const height = this.cameras.main.height;
    const cookieScore = this.getCookie('highscore');
    const prevScore = parseInt(cookieScore, 10);
    // const cookieTime = this.getCookie('time');
    // const bestTime = parseInt(cookieTime, 10);

    this.bg = this.add.image(0, 0, 'sky');
    this.bg.setOrigin(0, 0);

    this.scoreText = this.add.text(width / 2, height / 2 - 20, 'Score: 0', {
      fontFamily: 'Lato, sans-serif', fontSize: '24px', fill: '#333', wordWrap: true, align: 'center',
    });
    this.scoreText.setOrigin(0.5, 0.5);
    this.highscoreText = this.add.text(width - 150, 40, 'Personal high score: 0', {
      fontFamily: 'Lato, sans-serif', fontSize: '20px', fill: '#333', wordWrap: true, align: 'center',
    });
    this.highscoreText.setOrigin(0.5, 0.5);

    if (prevScore) {
      if (prevScore >= this.score) {
        this.scoreText.setText(`Score: ${this.score}`);
        this.highscoreText.setText(`Your high score: ${prevScore}`);
      } else {
        this.highscoreText.setText(`Your high score: ${this.score}`);
        this.scoreText.setText(`New high score: ${this.score}`);
        document.cookie = `highscore= ${this.score}`;
      }
    } else {
      document.cookie = `highscore= ${this.score}`;
    }

    // if (bestTime !== '') {
    //   if (bestTime <= this.time) {
    //     this.timeText = this.add.text(width / 2, height / 2 - 20, `Time: ${this.timeElapsed}`, {
    //       fontFamily: 'Lato, sans-serif', fontSize: '20px', fill: '#fff', wordWrap: true, align: 'center',
    //     });
    //     this.bestTimeText = this.add.text(width / 2, height / 2, `Best time: ${bestTime}`, {
    //       fontFamily: 'Lato, sans-serif', fontSize: '20px', fill: '#fff', wordWrap: true, align: 'center',
    //     });
    //     this.timeText.setOrigin(0.5, 0.5);
    //     this.bestTimeText.setOrigin(0.5, 0.5);
    //   } else {
    //     this.timeText = this.add.text(width / 2, height / 2 + 30, `Time: ${this.timeElapsed}`, {
    //       fontFamily: 'Lato, sans-serif', fontSize: '20px', fill: '#fff', wordWrap: true, align: 'center',
    //     });
    //     this.timeText.setOrigin(0.5, 0.5);
    //     document.cookie = `time= ${this.timeElapsed}`;
    //   }
    // } else {
    //   document.cookie = `time= ${this.timeElapsed}`;
    // }

    this.gameOverText = this.add.text(width / 2, height / 2 - 70, 'Game Over', {
      fontFamily: 'Lato, sans-serif', fontSize: '40px', fill: '#333', wordWrap: true, align: 'center',
    });
    this.gameOverText.setOrigin(0.5, 0.5);

    this.button = this.add.image(width / 2, height / 2 + 70, 'tryAgain');
    this.button.setOrigin(0.5, 0.5);

    this.star = this.add.image(width - 270, 40, 'star');

    // this.cameras.main.setBackgroundColor('#ade6ff');
    // this.cameras.main.fadeIn(2000, 255, 255, 255);
    // const logo = this.add.image(400, 300, 'logo');
    // logo.setDepth(1);
    this.input.on('pointerdown', () => {
      this.scene.start('scene1');
      // this.gameOver = false;
      // this.anims.resumeAll();
      // this.physics.resume();
      // this.tweens.resumeAll();
    });
  }

  getCookie(cname) {
    const cookieName = cname + '=';
    const cookieArray = document.cookie.split(';');
    for (let i = 0; i < cookieArray.length; i += 1) {
      let c = cookieArray[i];
      while (c.charAt(0) === ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(cookieName) === 0) {
        return c.substring(cookieName.length, c.length);
      }
    }
    return "";
  }
}

export default GameoverScreen;
