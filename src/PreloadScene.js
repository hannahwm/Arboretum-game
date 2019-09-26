import Phaser, { Scene } from 'phaser';

class PreloadScene extends Scene {
  constructor() {
    super('preload'); // key: preload
  }

  init(data) {
    this.hasTouch = data.touch;
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

    this.load.image('jump', '/interactive/2019/08/phaser-game-controls/assets/jump.png');
    this.load.image('up', '/interactive/2019/08/phaser-game-controls/assets/upArr.png');
    this.load.image('down', '/interactive/2019/08/phaser-game-controls/assets/down.png');
    this.load.image('right', '/interactive/2019/08/phaser-game-controls/assets/rightArr.png');
    this.load.image('left', '/interactive/2019/08/phaser-game-controls/assets/leftArr.png');
    this.load.image('sky', 'interactive/2019/08/phaser-game-controls/assets/sky.png');
    this.load.image('winscreen', 'interactive/2019/08/phaser-game-controls/assets/win-screen.png');
    this.load.image('middle', 'interactive/2019/08/phaser-game-controls/assets/middle.png');
    this.load.image('background', 'interactive/2019/08/phaser-game-controls/assets/background.png');
    this.load.image('ground', 'interactive/2019/08/phaser-game-controls/assets/ground.png');
    this.load.image('platform', 'interactive/2019/08/phaser-game-controls/assets/platform.png');
    this.load.image('ladder', 'interactive/2019/08/phaser-game-controls/assets/ladder.png');
    this.load.image('goal', 'interactive/2019/08/phaser-game-controls/assets/goal.png');
    this.load.image('pond', 'interactive/2019/08/phaser-game-controls/assets/pond.png');
    this.load.image('bridge', 'interactive/2019/08/phaser-game-controls/assets/bridge.png');
    this.load.image('nut', 'interactive/2019/08/phaser-game-controls/assets/nut.png');
    this.load.image('star', 'interactive/2019/08/phaser-game-controls/assets/star.png');
    this.load.image('tryAgain', 'interactive/2019/08/phaser-game-controls/assets/try-again.png');
    this.load.image('playAgain', 'interactive/2019/08/phaser-game-controls/assets/play-again.png');
    this.load.image('share', 'interactive/2019/08/phaser-game-controls/assets/share.png');
    this.load.image('books', 'interactive/2019/08/phaser-game-controls/assets/books.png');
    this.load.spritesheet('dude',
      'interactive/2019/08/phaser-game-controls/assets/player.png',
      { frameWidth: 23, frameHeight: 38 });
    this.load.spritesheet('squirrel',
      'interactive/2019/08/phaser-game-controls/assets/squirrel.png',
      { frameWidth: 43, frameHeight: 48 });
    this.load.spritesheet('pigeon',
      'interactive/2019/08/phaser-game-controls/assets/pigeon.png',
      { frameWidth: 50, frameHeight: 41 });
      this.load.spritesheet('boss',
        'interactive/2019/08/phaser-game-controls/assets/boss.png',
        { frameWidth: 150, frameHeight: 150 });
    this.load.image('sky2', 'interactive/2019/08/phaser-game-controls/assets/sky2.png');
    this.load.image('middle2', 'interactive/2019/08/phaser-game-controls/assets/middle2.png');
    this.load.image('background2', 'interactive/2019/08/phaser-game-controls/assets/background2.png');
    // this.load.image('sky3', 'interactive/2019/08/phaser-game-controls/assets/sky3.png');
    // this.load.image('middle3', 'interactive/2019/08/phaser-game-controls/assets/middle3.png');
    this.load.image('background3', 'interactive/2019/08/phaser-game-controls/assets/background3.png');

    this.load.on('progress', (value) => {
      percentText.setText(parseInt(`${value * 100} %`));
      progressBar.clear();
      progressBar.fillStyle(0xffffff, 1);
      progressBar.fillRect(250, 280, 300 * value, 30);
    });

    this.load.on('complete', () => {

      this.scene.start('scene3', { touch: this.hasTouch });
    });
  }

  create() {
    this.createAnimation();

    // this.cameras.main.setBackgroundColor('#ade6ff');
    // this.cameras.main.fadeIn(2000, 255, 255, 255);
    // const logo = this.add.image(400, 300, 'logo');
    // logo.setDepth(1);
    // this.input.on('pointerdown', () => this.scene.start('scene1'));
  }

  createAnimation() {
    this.anims.create({
      key: 'left',
      frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: 'turn',
      frames: [{ key: 'dude', frame: 4 }],
      frameRate: 20,
    });

    this.anims.create({
      key: 'back',
      frames: [{ key: 'dude', frame: 11 }],
      frameRate: 20,
    });

    this.anims.create({
      key: 'right',
      frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: 'climb',
      frames: this.anims.generateFrameNumbers('dude', { start: 9, end: 10 }),
      frameRate: 4,
      repeat: -1,
    });

    this.anims.create({
      key: 'squirrel',
      frames: this.anims.generateFrameNumbers('squirrel', { start: 1, end: 3 }),
      frameRate: 5,
      yoyo: true,
      repeat: -1,
    });

    this.anims.create({
      key: 'boss',
      frames: this.anims.generateFrameNumbers('boss', { start: 1, end: 3 }),
      frameRate: 3,
      yoyo: true,
      repeat: -1,
    });

    this.anims.create({
      key: 'pigeon',
      frames: this.anims.generateFrameNumbers('pigeon', { start: 0, end: 1 }),
      frameRate: 1,
      // yoyo: true,
      repeat: -1,
    });
  }
}

export default PreloadScene;
