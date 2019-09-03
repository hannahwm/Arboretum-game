import Phaser, { Scene } from 'phaser';

class StartScreen extends Scene {
  constructor() {
    super('startscreen');
  }

  preload() {

    const width = this.cameras.main.width;
    const height = this.cameras.main.height;
    const loadingText = this.make.text({
      x: width / 2,
      y: height / 2,
      text: 'Start Game',
      style: {
        font: '20px monospace',
        fill: '#ffffff',
      },
    });
    loadingText.setOrigin(0.5, 0.5);

    this.load.image('logo', '/interactive/2019/08/phaser-game/assets/logo.png');
  }

  create() {
    // this.cameras.main.setBackgroundColor('#ade6ff');
    // this.cameras.main.fadeIn(2000, 255, 255, 255);
    // const logo = this.add.image(400, 300, 'logo');
    // logo.setDepth(1);
    this.input.on('pointerdown', () => this.scene.start('preload'));
  }
}

export default StartScreen;
