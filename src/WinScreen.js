import Phaser, { Scene } from 'phaser';

const $ = jQuery;

$('.game-share__close').on('click touchstart', () => {
  $('.game-share').fadeOut();
});

class WinScreen extends Scene {
  constructor() {
    super('winscreen');
  }

  // this is where data is carried over from the previous level
  init(data) {
    this.score = data.score;
    this.timeElapsed = data.time;
    this.booksNum = data.books;
    this.width = this.cameras.main.width;
    this.height = this.cameras.main.height;
  }

  preload() {
  }

  create() {
    const cookieScore = this.getCookie('highscore');
    const prevScore = parseInt(cookieScore, 10);
    const cookieTime = this.getCookie('time');
    const bestTime = parseInt(cookieTime, 10);

    // convert seconds to pretty time
    const curMinutes = Math.floor(this.timeElapsed / 60);
    const curSeconds = Math.floor(this.timeElapsed) - (60 * curMinutes);
    let curResult = (curMinutes < 10) ? `0 ${curMinutes}` : curMinutes;
    curResult += (curSeconds < 10) ? `:0 ${curSeconds}` : `: ${curSeconds}`;

    const bestMinutes = Math.floor(bestTime / 60);
    const bestSeconds = Math.floor(bestTime) - (60 * bestMinutes);
    let bestResult = (bestMinutes < 10) ? `0 ${bestMinutes}` : bestMinutes;
    bestResult += (bestSeconds < 10) ? `:0 ${bestSeconds}` : `: ${bestSeconds}`;

    const curTime = curResult;
    const savedTime = bestResult;

    this.bg = this.add.image(0, 0, 'winscreen');
    this.bg.setOrigin(0, 0);

    // ========================================================
    // Set the position of the text
    this.winText = this.add.text(this.width / 2, this.height / 2 - 80, 'Congratulations!', {
      fontFamily: 'Lato, sans-serif', fontSize: '24px', fill: '#333', wordWrap: { width: 500, useAdvancedWrap: true }, align: 'center', lineSpacing: 26,
    });
    this.winText.setOrigin(0.5, 0.5);

    this.scoreText = this.add.text(this.width / 2, this.height / 2 + 90, 'Score: 0', {
      fontFamily: 'Lato, sans-serif', fontSize: '20px', fill: '#333', wordWrap: true, align: 'center',
    });
    this.scoreText.setOrigin(0.5, 0.5).visible = false;

    this.highscoreText = this.add.text(this.width - 150, 40, 'Your high score: 0', {
      fontFamily: 'Lato, sans-serif', fontSize: '20px', fill: '#333', wordWrap: true, align: 'center',
    });
    this.highscoreText.setOrigin(0.5, 0.5).visible = false;

    this.timeText = this.add.text(this.width / 2, this.height / 2 + 130, 'Time: 0', {
      fontFamily: 'Lato, sans-serif', fontSize: '20px', fill: '#333', wordWrap: true, align: 'center',
    });
    this.timeText.setOrigin(0.5, 0.5).visible = false;

    this.bestTimeText = this.add.text(this.width - 150, 80, 'Best Time: 0', {
      fontFamily: 'Lato, sans-serif', fontSize: '20px', fill: '#333', wordWrap: true, align: 'center',
    });
    this.bestTimeText.setOrigin(0.5, 0.5).visible = false;

    this.button = this.add.image(this.width / 2 - 100, this.height / 2 + 200, 'playAgain');

    // ========================================================
    // Display the text based on the results
    if (this.booksNum === 22) {
      this.winText.setText('Congratulations! You made it to the library and managed to return ALL of your books.');

      // only show score and time if all of the books were retrieved
      if (prevScore) {
        if (prevScore >= this.score) {
          this.scoreText.setText(`Score: ${this.score}`).setVisible(true);
          this.highscoreText.setText(`Your high score: ${prevScore}`).setVisible(true);
        } else {
          this.highscoreText.setText(`Your high score: ${this.score}`).setVisible(true);
          this.scoreText.setText(`New high score: ${this.score}`).setVisible(true);
          document.cookie = `highscore= ${this.score}`;
        }
      } else {
        document.cookie = `highscore= ${this.score}`;
      }

      if (bestTime) {
        this.timeText.setText(`Time: ${curTime}`).setVisible(true);
        if (bestTime >= this.timeElapsed) {
          document.cookie = `time= ${this.timeElapsed}`;
          this.bestTimeText.setText(`Best time: ${curTime}`).setVisible(true);
        } else {
          this.bestTimeText.setText(`Best time: ${savedTime}`).setVisible(true);
        }
      } else {
        this.timeText.setText(`Time: ${curTime}`).setVisible(true);
        document.cookie = `time= ${this.timeElapsed}`;
      }
      this.star = this.add.image(this.width - 270, 40, 'star');
      this.button = this.add.image(this.width / 2 - 100, this.height / 2 + 200, 'playAgain');
    } else {
      this.winText.setText(`You made it to the library and managed to return ${this.booksNum} of your books. There are still more books to return though. See if you can get them all next time!`);
      this.button = this.add.image(this.width / 2 - 100, this.height / 2 + 200, 'tryAgain');
    }

    this.button.setOrigin(0.5, 0.5).setInteractive();

    this.button.on('pointerdown', () => {
      this.scene.start('scene1');
    });

    this.share = this.add.image(this.width / 2 + 100, this.height / 2 + 200, 'share');

    this.share.setOrigin(0.5, 0.5).setInteractive();

    this.share.on('pointerdown', () => {
      $('.game-share').fadeIn();
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

export default WinScreen;
