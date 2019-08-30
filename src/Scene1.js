import Phaser, { Scene } from 'phaser';
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
    this.load.image('goal', 'interactive/2019/08/phaser-game/assets/door.png');
    this.load.image('nut', 'interactive/2019/08/phaser-game/assets/nut.png');
    this.load.image('books', 'interactive/2019/08/phaser-game/assets/books.png');
    this.load.spritesheet('dude',
      'interactive/2019/08/phaser-game/assets/player.png',
      { frameWidth: 24, frameHeight: 36 });
    this.load.spritesheet('squirrel',
      'interactive/2019/08/phaser-game/assets/squirrel.png',
      { frameWidth: 43, frameHeight: 48 });
  }

  create() {
    this.cameras.main.setBackgroundColor('#C9E9F0');
    this.cameras.main.fadeIn(2000, 255, 255, 255);

    this.createGround();
    this.createPlatforms();
    this.createLadders();
    this.createGoal();
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
    this.ground.create(400, 600, 'ground');
    this.ground.setDepth(3);

    this.ground.children.iterate((child) => {
      child.setScale(2);
      child.setSize(4200, 63);
      child.setOffset(0, -8);
    });
  }

  createPlatforms() {
    this.platforms = this.physics.add.staticGroup();
    // platform 1
    this.platforms.create(540, 480, 'platform');
    // platform 2
    this.platforms.create(840, 380, 'platform');
    // platform 3
    this.platforms.create(1140, 460, 'platform');

    this.platforms.children.iterate((child) => {
      child.setSize(160, 33);
      child.setOffset(0, 7);
    });

    this.platforms.setDepth(6);
  }

  createLadders() {
    this.ladders = this.physics.add.staticGroup();
    this.ladders.create(300, 440, 'ladder');
    this.ladders.setDepth(4);

    this.ladders.children.iterate((child) => {
      child.setSize(40, 230);
      child.setOffset(45, 35);
    });
  }

  createGoal() {
    this.goal = this.physics.add.image(1700, 480, 'goal');
    this.goal.setDepth(4);
    this.goal.setOffset(40, -20);
    this.physics.add.collider(this.goal, this.ground);
  }

  createPlayer() {
    this.player = this.physics.add.sprite(100, 500, 'dude');
    this.player.setSize(24, 36);
    this.player.setScale(1.5);
    // this.player.setOffset(3, 7);
    this.player.setBounce(0.2);
    this.player.setGravityY(300);
    this.player.setDepth(4);
    this.player.setCollideWorldBounds(true);
    this.physics.add.collider(this.player, this.platforms);
    this.physics.add.collider(this.player, this.ground);
    this.physics.add.overlap(this.player, this.goal, this.touchGoal, false, this);
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

    this.enemies = this.add.group();

    const enemy1 = this.physics.add.sprite(480, 440, 'squirrel').setDepth(5);
    const enemy2 = this.physics.add.sprite(800, 340, 'squirrel').setDepth(5);
    const enemy3 = this.physics.add.sprite(1100, 340, 'squirrel').setDepth(5);


    this.enemies.addMultiple([enemy1, enemy2, enemy3], true);

    for (let i = 0; i < this.enemies.children.size; i += 1) {
      const child = this.enemies.children.entries[i];
      const index = i;
      child.setDepth(5).setGravityY(300);
      child.anims.play('squirrel');
      this.physics.add.collider(this.player, child, this.touchEnemy, null, this);
      this.physics.add.collider(child, this.platforms);

      this.squirrelTween = this.tweens.add({
        targets: child,
        x: child.x + 100,
        ease: 'Power0',
        duration: 3000,
        delay: index * 2000,
        flipX: true,
        yoyo: true,
        repeat: -1,
        // repeatDelay: 500,
        onRepeat: () => {
          const curX = child.x - 20;
          const curY = child.y;
          this.nut = this.physics.add.image(curX, curY, 'nut');
          this.nut.setBounce(1);
          this.nut.setDepth(5);
          this.nut.setVelocityY(80).setVelocityX(-350);
          this.physics.add.collider(this.player, this.nut, this.hitNut, null, this);
        },
      });
    }
  }

  createCursor() {
    this.cursors = this.input.keyboard.createCursorKeys();
  }

  createBooks() {
    this.books = this.physics.add.group({
      key: 'books',
      repeat: 3,
      setXY: { x: 300, y: 300, stepX: 270 },
    });

    this.books.children.iterate((child) => {
      child.setDepth(4);
    });

    this.physics.add.collider(this.books, this.platforms);
    this.physics.add.collider(this.books, this.ladders);
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
    if (player.y < (enemy.y - (enemy.displayHeight - 10) )) {
      enemy.body.velocity.x = 0;
      enemy.y += 20;
      // enemy.destroy();
      player.y -= 30;
      this.score += 100;
      this.scoreText.setText(`Score: ${this.score}`);
    } else {
      this.healthBar.setSize(0, 20);
      player.setTint(0xff0000);
      player.anims.play('turn');
      this.anims.pauseAll();
      this.physics.pause();
      this.tweens.killAll();
      this.cameras.main.shake(100, 0.01);
      this.gameOver = true;
      this.gameOverText.visible = true;
    }

    // this.scene.restart();
    // this.input.on('pointerdown', () => this.scene.start('preload'));
  }

  touchGoal() {
    this.scene.start('scene2');
    // this.cameras.main.fadeOut(2000, 255, 255, 255, () => {
    //   this.on('camerafadeoutcomplete', () => {
    //   }, this);
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
        this.player.setGravityY(-4);
        this.player.setVelocityY(-4);
        onLadder = false;
      } else {
        this.player.setGravityY(300);
      }
    }

    // jumping
    if (this.jumpButton.isDown && (this.player.body.onFloor() || this.player.body.touching.down)) {
      this.player.setVelocityY(-355);
    }

  }
}

export default Scene1;
