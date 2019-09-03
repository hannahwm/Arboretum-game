import Phaser, { Scene } from 'phaser';

class PreloadScene extends Scene {
  constructor() {
    super('preload'); // key: preload
  }

  preload() {
    const progressBar = this.add.graphics();
    const progressBox = this.add.graphics();
    progressBox.fillStyle(0x222222, 0.8);
    progressBox.fillRect(240, 270, 320, 50);

    const width = this.cameras.main.width;
    const height = this.cameras.main.height;
    const loadingText = this.make.text({
      x: width / 2,
      y: height / 2 - 50,
      text: 'Loading...',
      style: {
        font: '20px monospace',
        fill: '#ffffff',
      },
    });
    loadingText.setOrigin(0.5, 0.5);

    const percentText = this.make.text({
      x: width / 2,
      y: height / 2 - 5,
      text: '0%',
      style: {
        font: '18px monospace',
        fill: '#ffffff',
      },
    });
    percentText.setOrigin(0.5, 0.5);

    this.load.image('logo', '/interactive/2019/08/phaser-game/assets/logo.png');
    this.load.image('sky', 'interactive/2019/08/phaser-game/assets/sky.png');
    this.load.image('middle', 'interactive/2019/08/phaser-game/assets/middle.png');
    this.load.image('background', 'interactive/2019/08/phaser-game/assets/background.png');
    this.load.image('ground', 'interactive/2019/08/phaser-game/assets/ground.png');
    this.load.image('platform', 'interactive/2019/08/phaser-game/assets/platform.png');
    this.load.image('ladder', 'interactive/2019/08/phaser-game/assets/ladder.png');
    this.load.image('goal', 'interactive/2019/08/phaser-game/assets/goal.png');
    this.load.image('nut', 'interactive/2019/08/phaser-game/assets/nut.png');
    this.load.image('books', 'interactive/2019/08/phaser-game/assets/books.png');
    this.load.spritesheet('dude',
      'interactive/2019/08/phaser-game/assets/player.png',
      { frameWidth: 23, frameHeight: 38 });
    this.load.spritesheet('squirrel',
      'interactive/2019/08/phaser-game/assets/squirrel.png',
      { frameWidth: 43, frameHeight: 48 });
    this.load.spritesheet('pigeon',
      'interactive/2019/08/phaser-game/assets/pigeon.png',
      { frameWidth: 50, frameHeight: 41 });
    this.load.image('sky2', 'interactive/2019/08/phaser-game/assets/sky2.png');
    this.load.image('middle2', 'interactive/2019/08/phaser-game/assets/middle2.png');
    this.load.image('background2', 'interactive/2019/08/phaser-game/assets/background2.png');

    this.load.on('progress', (value) => {
      percentText.setText(parseInt(`${value * 100} %`));
      progressBar.clear();
      progressBar.fillStyle(0xffffff, 1);
      progressBar.fillRect(250, 280, 300 * value, 30);
    });

    this.load.on('complete', () => {

      this.scene.start('scene1');
      setTimeout(() => {
        // progressBar.destroy();
        // progressBox.destroy();
        // loadingText.destroy();
        // percentText.destroy();
      }, 500);
    });
  }

  create() {
    // this.cameras.main.setBackgroundColor('#ade6ff');
    // this.cameras.main.fadeIn(2000, 255, 255, 255);
    // const logo = this.add.image(400, 300, 'logo');
    // logo.setDepth(1);
    // this.input.on('pointerdown', () => this.scene.start('scene1'));
  }
}

export default PreloadScene;
