import Phaser, { Scene } from 'phaser';

class Instructions extends Scene {
  constructor() {
    super('instructions');
  }

  // this is where data is carried over from the previous level
  init(data) {
    this.hasTouch = data.touch;
  }

  preload() {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;
    const loadingText = this.make.text({
      x: width / 2,
      y: height / 2 - height / 5,
      text: 'Squirrels have hidden your library books in the trees around campus. You must retrieve your books and return them to the library as quickly as you can, but be careful not to anger the squirrels!',
      style: {
        font: '20px Lato, sans-serif',
        fill: '#333',
        align: 'center',
        wordWrap: { width: width / 1.45, useAdvancedWrap: true },
        lineSpacing: 26,
      },
    });
    loadingText.setOrigin(0.5, 0.5);

    this.load.image('bg', '/interactive/2019/08/phaser-game-controls/assets/instructions-bg.png');
  }

  create() {
    this.cameras.main.setBackgroundColor('#ade6ff');

    const bg = this.add.image(0, 0, 'bg');
    bg.setOrigin(0, 0);

    this.add.text(580, 550, 'Click anywhere to continue', {
      fontFamily: 'Lato, sans-serif', fontSize: '16px', fill: '#333',
    });

    this.input.on('pointerdown', () => this.scene.start('preload', { touch: this.hasTouch }));
  }
}

export default Instructions;
