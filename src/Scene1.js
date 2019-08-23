import Phaser, { Scene } from 'phaser';
import Level from './Level';
import gameConfig from './gameConfig';

let onLadder = false;

const global = {}

class Scene1 extends Scene {
  constructor() {
    super('scene1'); // key: scene1
    this.score = 0;
    this.gameOver = false;
    // this.onLadder = false;
    // this.isClimbing = false;
  }

  preload() {
    this.load.image('sky', 'interactive/2019/08/phaser-game/assets/sky.png');
    this.load.image('middle', 'interactive/2019/08/phaser-game/assets/middle.png');
    this.load.image('background', 'interactive/2019/08/phaser-game/assets/background.png');
    this.load.image('ground', 'interactive/2019/08/phaser-game/assets/ground.png');
    this.load.image('platform', 'interactive/2019/08/phaser-game/assets/platform.png');
    this.load.image('ladder', 'interactive/2019/08/phaser-game/assets/ladder.png');
    this.load.image('nut', 'interactive/2019/08/phaser-game/assets/nut.png');
    this.load.spritesheet('dude',
      'interactive/2019/08/phaser-game/assets/dude.png',
      { frameWidth: 32, frameHeight: 48 });
    this.load.spritesheet('squirrel',
      'interactive/2019/08/phaser-game/assets/squirrel.png',
      { frameWidth: 43, frameHeight: 48 });
  }

  create() {
    this.createGround();
    this.createPlatforms();
    this.createLadders();
    this.createPlayer();
    this.createEnemies();
    this.createBackground();
    this.createCursor();
    this.createJumpButton();
    this.createNuts();
    this.throwNut();
    this.cameras.main.setBounds(0, 0, this.map.width, this.map.height);
    this.physics.world.setBounds(0, 0, this.map.getBounds().width,
      this.map.height + this.player.height);
    this.cameras.main.startFollow(this.player, true, 0.5, 0.5, 0, 180);

    this.scoreText = this.add.text(16, 50, 'score: 0', {
      fontSize: '32px', fill: '#000', wordWrap: true, wordWrapWidth: this.player.width, align: 'center',
    });
    this.scoreText.setScrollFactor(0);
    this.gameOverText = this.add.text(400, 300, 'Game Over', { fontSize: '64px', fill: '#000' });
    this.gameOverText.setOrigin(0.5);
    this.gameOverText.visible = false;
    this.gameOverText.setScrollFactor(0);
    this.gameOverText.setDepth(5);
  }

  createBackground() {
    this.map = this.add.image(0, 0, 'background');
    this.map.setDepth(2);
    this.map.setOrigin(0, 0.05);
    // this.map.setScale(0.75);

    this.middle = this.add.image(0, 0, 'middle');
    this.middle.setDepth(1);
    this.middle.setOrigin(0, 0.05);
    // this.middle.setScale(0.75);

    this.sky = this.add.image(0, 0, 'sky');
    this.sky.setDepth(0);
    this.sky.setOrigin(0, 0);
    // this.sky.setScale(0.5);

    const gameWidth = parseFloat(this.map.getBounds().width);
    const windowWidth = gameConfig.width;
    const bgWidth = this.map.getBounds().width;
    const middleWidth = this.middle.getBounds().width;
    const skyWidth = this.sky.getBounds().width;

    this.map.setScrollFactor((bgWidth - windowWidth) / (gameWidth - windowWidth));
    this.middle.setScrollFactor((middleWidth - windowWidth) / (gameWidth - windowWidth));
    this.sky.setScrollFactor((skyWidth - windowWidth) / (gameWidth - windowWidth));
  }

  createGround() {
    this.ground = this.physics.add.staticGroup();
    this.ground.create(400, 610, 'ground');
    this.ground.setDepth(3);

    this.ground.children.iterate((child) => {
      child.setScale(2);
      child.setSize(4200, 63);
      child.setOffset(0, -18);
    });
  }

  createPlatforms() {
    this.platforms = this.physics.add.staticGroup();
    this.platforms.create(480, 480, 'platform');
    this.platforms.setDepth(4);

    this.platforms.children.iterate((child) => {
      child.setSize(160, 33);
      child.setOffset(0, 7);
    });
  }

  createLadders() {
    this.ladders = this.physics.add.staticGroup();
    this.ladders.create(300, 460, 'ladder');
    this.ladders.setDepth(3);

    this.ladders.children.iterate((child) => {
      child.setSize(40, 250);
      child.setOffset(45, 5);
    });
  }


  createPlayer() {
    this.player = this.physics.add.sprite(100, 550, 'dude');
    this.player.setSize(25, 40);
    this.player.setOffset(3, 7);
    this.player.setBounce(0.2);
    this.player.setGravityY(300);
    this.player.setDepth(3);
    this.player.setCollideWorldBounds(true);
    this.physics.add.collider(this.player, this.platforms);
    this.physics.add.collider(this.player, this.ground);
    this.physics.add.overlap(this.player, this.ladders, this.detectOverlap);

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
      key: 'right',
      frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
      frameRate: 10,
      repeat: -1,
    });
  }

  createEnemies() {
    this.anims.create({
      key: 'squirrel',
      frames: this.anims.generateFrameNumbers('squirrel', { start: 1, end: 3 }),
      frameRate: 5,
      yoyo: true,
      repeat: -1,
    });

    this.enemy = this.physics.add.sprite(420, 440, 'squirrel');
    this.enemy.anims.play('squirrel');
    this.enemy.setDepth(3);
    this.enemy.setGravityY(300);

    this.physics.add.collider(this.player, this.enemy, this.touchEnemy, null, this);
    this.physics.add.collider(this.enemy, this.platforms);

    this.squirrelTween = this.tweens.add({
      targets: this.enemy,
      x: 540,
      ease: 'Power0',
      duration: 3000,
      flipX: true,
      yoyo: true,
      repeat: -1,
      onRepeat: this.throwNut,
    });
  }

  createCursor() {
    this.cursors = this.input.keyboard.createCursorKeys();
  }

  createJumpButton() {
    this.jumpButton = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
  }

  detectOverlap() {
    onLadder = true;
    // console.log(`detect on ladder ${onLadder}`);
  }

  touchEnemy(player, enemy) {
    player.setTint(0xff0000);
    player.anims.play('turn');
    this.anims.pauseAll();
    this.physics.pause();
    this.squirrelTween.stop();
    this.cameras.main.shake(100, 0.01);
    this.gameOver = true;
    this.gameOverText.visible = true;

    // this.scene.restart();
    // this.input.on('pointerdown', () => this.scene.start('preload'));
  }

  createNuts() {
    global.nuts = this.physics.add.group();
    // this.physics.add.collider(this.nuts, this.platforms);
    this.physics.add.collider(this.player, this.nuts);
    // , this.hitBomb, null, this

    global.nutParticles = this.add.particles('nut');
    global.nutEmitter = global.nutParticles.createEmitter({
      x: 300,
      y: 500,
      lifespan: 2000,
      speedX: -10,
      speedY: 10,
      quantity: 3,
      blendMode: 'ADD',
    });
  }

  throwNut() {
    console.log("throw nut");
    const nut = global.nuts.create(200, 400, 'nut');
    nut.setDepth(5);
    // .setVelocity(Phaser.Math.Between(-200, 200), 20);

    // const nuts = global.nuts.add.particles('nut');
    // nuts.setDepth(5);
    // const emitter = nuts.createEmitter({
    //   x: 300,
    //   y: 500,
    //   lifespan: 2000,
    //   speedX: -10,
    //   speedY: 10,
    //   quantity: 3,
    //   blendMode: 'ADD',
    // });
  }

  // ========================================================
  // Update

  update() {
    if (this.gameOver) {
      return;
    }

    // console.log(`update on ladder ${onLadder}`);
    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-160);
      this.player.x -= 2.5;

      this.player.anims.play('left', true);
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(160);
      this.player.x += 2.5;

      this.player.anims.play('right', true);
    } else {
      this.player.setVelocityX(0);

      this.player.anims.play('turn');
    }

    if (this.cursors.up.isDown && onLadder === true) {
      this.player.setGravityY(0);
      this.player.anims.play('turn', true);
      this.player.setVelocityY(-160);
      // console.log('not climbing');
      onLadder = false;
    } else if (this.cursors.down.isDown && onLadder === true) {
      this.player.setGravityY(0);
      this.player.anims.play('turn', true);
      this.player.setVelocityY(160);
      onLadder = false;
    } else {
      if (onLadder === true) {
        this.player.setGravityY(0);
        this.player.setVelocityY(0);
        onLadder = false;
      } else {
        this.player.setGravityY(300);
      }
    }

    // jumping
    if (this.jumpButton.isDown && (this.player.body.onFloor() || this.player.body.touching.down)) {
      this.player.setVelocityY(-270);
    }

    // move enemy

    // if (this.enemy.x > 500) {
    //   this.enemy.x -= 2;
    // } else {
    //   this.enemy.x += 2;
    // }
  }
}

export default Scene1;
