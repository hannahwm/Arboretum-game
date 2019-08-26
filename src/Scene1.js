import Phaser, { Scene } from 'phaser';
import Level from './Level';
import gameConfig from './gameConfig';

let onLadder = false;
let colliderActivated = true;

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
    this.load.image('books', 'interactive/2019/08/phaser-game/assets/books.png');
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
    this.createBooks();
    this.createHealthBar();
    this.createBackground();
    this.createCursor();
    this.createJumpButton();
    this.cameras.main.setBounds(0, 0, this.map.width, this.map.height);
    this.physics.world.setBounds(0, 0, this.map.getBounds().width,
      this.map.height + this.player.height);
    this.cameras.main.startFollow(this.player, true, 0.5, 0.5, 0, 180);

    this.scoreText = this.add.text(16, 20, 'score: 0', {
      fontSize: '32px', fill: '#000', wordWrap: true, wordWrapWidth: this.player.width, align: 'center',
    });
    this.scoreText.setScrollFactor(0);
    this.gameOverText = this.add.text(400, 300, 'Game Over', { fontSize: '64px', fill: '#000' });
    this.gameOverText.setOrigin(0.5);
    this.gameOverText.visible = false;
    this.gameOverText.setScrollFactor(0);
    this.gameOverText.setDepth(5);
  }

  createHealthBar() {
    this.add.rectangle(700, 40, 124, 24, '0x000000').setDepth(5).setScrollFactor(0);
    this.healthBar = this.add.rectangle(700, 40, 120, 20, '0xcc0000');
    this.healthBar.setDepth(6);
    this.healthBar.setScrollFactor(0);
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
    this.platforms.create(580, 480, 'platform');
    this.platforms.setDepth(5);

    this.platforms.children.iterate((child) => {
      child.setSize(160, 33);
      child.setOffset(0, 7);
    });
  }

  createLadders() {
    this.ladders = this.physics.add.staticGroup();
    this.ladders.create(300, 450, 'ladder');
    this.ladders.setDepth(4);

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
    this.player.setDepth(4);
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

    global.enemy = this.physics.add.sprite(520, 440, 'squirrel');
    global.enemy.anims.play('squirrel');
    global.enemy.setDepth(4);
    global.enemy.setGravityY(300);

    this.physics.add.collider(this.player, global.enemy, this.touchEnemy, null, this);
    this.physics.add.collider(global.enemy, this.platforms);

    this.squirrelTween = this.tweens.add({
      targets: global.enemy,
      x: 640,
      ease: 'Power0',
      duration: 3000,
      flipX: true,
      yoyo: true,
      repeat: -1,
      onRepeat: () => {
        console.log("throw nut");
        const curX = global.enemy.x - 20;
        const curY = global.enemy.y;

        this.nut = this.physics.add.image(curX, curY, 'nut');
        this.nut.setBounce(1);
        this.nut.setDepth(5);
        this.nut.setVelocityY(80).setVelocityX(-350);
        this.physics.add.collider(this.player, this.nut, this.hitNut, null, this);
      },
    });
  }

  createCursor() {
    this.cursors = this.input.keyboard.createCursorKeys();
  }

  createBooks() {
    this.books = this.physics.add.group({
      key: 'books',
      repeat: 3,
      setXY: { x: 550, y: 300, stepX: 400 },
    });

    this.books.children.iterate((child) => {
      child.setDepth(3);
    });

    this.physics.add.collider(this.books, this.platforms);
    this.physics.add.overlap(this.player, this.books, this.collectBooks, null, this);
  }

  collectBooks(player, books) {
    books.disableBody(true, true);

    this.score += 10;
    this.scoreText.setText(`Score: ${this.score}`);

    if (this.books.countActive(true) === 0) {
      this.books.children.iterate((child) => {
        child.enableBody(true, child.x, 0, true, true);
      });
    }
  }

  createJumpButton() {
    this.jumpButton = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
  }

  hitNut(player) {
    const curWidth = this.healthBar.displayWidth;
    player.setTint(0xff0000);
    this.cameras.main.shake(100, 0.01);

    setTimeout(() => {
      if (curWidth === 40) {
        this.healthBar.setSize(0, 20);
        player.anims.play('turn');
        this.anims.pauseAll();
        this.physics.pause();
        this.squirrelTween.stop();
        this.gameOver = true;
        this.gameOverText.visible = true;
      } else {
        this.healthBar.setSize(curWidth - 40, 20);
        player.clearTint();
      }
    }, 200);
  }

  detectOverlap() {
    onLadder = true;
  }

  touchEnemy(player, enemy) {

    if (player.y < enemy.y) {
      enemy.body.velocity.x = 0;
      enemy.y += 20;
      // enemy.destroy();
      this.squirrelTween.stop();
      player.y -= 30;
    } else {
      this.healthBar.setSize(0, 20);
      player.setTint(0xff0000);
      player.anims.play('turn');
      this.anims.pauseAll();
      this.physics.pause();
      this.squirrelTween.stop();
      this.cameras.main.shake(100, 0.01);
      this.gameOver = true;
      this.gameOverText.visible = true;
    }

    // this.scene.restart();
    // this.input.on('pointerdown', () => this.scene.start('preload'));
  }

  // ========================================================
  // Update

  update() {
    if (this.gameOver) {
      return;
    }
    // console.log(`update on ladder ${onLadder}`);
    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-100);
      this.player.x -= 2.5;

      this.player.anims.play('left', true);
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(100);
      this.player.x += 2.5;

      this.player.anims.play('right', true);
    } else {
      this.player.setVelocityX(0);

      this.player.anims.play('turn');
    }

    if (this.cursors.up.isDown && onLadder === true) {
      this.player.setGravityY(0);
      this.player.anims.play('turn', true);
      this.player.setVelocityY(-100);
      // console.log('not climbing');
      onLadder = false;
    } else if (this.cursors.down.isDown && onLadder === true) {
      this.player.setGravityY(0);
      this.player.anims.play('turn', true);
      this.player.setVelocityY(100);
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

    // if (global.enemy.x > 500) {
    //   global.enemy.x -= 2;
    // } else {
    //   global.enemy.x += 2;
    // }
  }
}

export default Scene1;
