import Phaser, { Scene } from 'phaser';

class Instructions extends Scene {
  constructor() {
    super('instructions');
  }

  // this is where data is carried over from the previous level
  init(data) {
    this.isSmall = data.small;
    this.isMedium = data.medium;
  }

  preload() {
    this.font = '20px Lato, sans-serif';
    this.lineHeight = 26;
    if (this.isSmall) {
      this.font = '12px Lato, sans-serif';
      this.lineHeight = 4;
    } else if (this.isMedium) {
      this.font = '14px Lato, sans-serif';
      this.lineHeight = 16;
    }
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;
    const loadingText = this.make.text({
      x: width / 2,
      y: height / 2 - height / 5,
      text: 'Squirrels have hidden your library books in the trees around campus. You must retrieve your books and return them to the library as quickly as you can, but be careful not to anger the squirrels!',
      style: {
        font: this.font,
        fill: '#333',
        align: 'center',
        wordWrap: { width: width / 1.45, useAdvancedWrap: true },
        lineSpacing: this.lineHeight,
      },
    });
    loadingText.setOrigin(0.5, 0.5);

    this.load.image('bg', '/interactive/2019/08/phaser-game/assets/instructions-bg.png');
  }

  create() {
    this.cameras.main.setBackgroundColor('#ade6ff');

    const bg = this.add.image(0, 0, 'bg');
    bg.setOrigin(0, 0);


    if (this.isSmall) {
      bg.setScale(0.4);
      this.add.text(180, 220, 'Click anywhere to continue', {
        fontFamily: 'Lato, sans-serif', fontSize: '10px', fill: '#333',
      });
    } else if (this.isMedium) {
      bg.setScale(0.5);
      this.add.text(580, 550, 'Click anywhere to continue', {
        fontFamily: 'Lato, sans-serif', fontSize: '16px', fill: '#333',
      });
    } else {
      this.add.text(580, 550, 'Click anywhere to continue', {
        fontFamily: 'Lato, sans-serif', fontSize: '16px', fill: '#333',
      });
    }

    // this.cameras.main.fadeIn(2000, 255, 255, 255);
    // const screen = this.add.image(0, 0, 'screen');
    // screen.setOrigin(0, 0);
    // logo.setDepth(1);
    this.input.on('pointerdown', () => this.scene.start('preload', { small: this.isSmall, medium: this.isMedium }));
  }
}

export default Instructions;
