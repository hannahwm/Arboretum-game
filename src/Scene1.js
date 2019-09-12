import Phaser, { Scene } from 'phaser';
import gameConfig from './gameConfig';

let onLadder = false;

class Scene1 extends Scene {
  constructor() {
    super('scene1'); // key: scene1
  }

  init(data) {
    this.isSmall = data.small;
    this.isMedium = data.medium;
  }

  create() {
    this.fadeTriggered = false;
    this.gameOver = false;
    this.score = 0;
    this.booksNum = 0;
    this.startTime = new Date();
    this.timeElapsed = 0;
    this.curTime = 0;
    this.cameras.main.setBackgroundColor('#C9E9F0');
    this.cameras.main.fadeIn(2000, 255, 255, 255);
    this.moveRight = false;
    this.moveLeft = false;
    this.moveUp = false;
    this.moveDown = false;

    if (this.isSmall) {
      this.fontSize = '12px';
    } else if (this.isMedium) {
      this.fontSize = '14px';
    } else {
      this.fontSize = '20px';
    }

    this.createGround();
    this.createPlatforms();
    this.createPlayer();
    this.createLadders();
    this.createGoal();
    this.createEnemies();
    this.createBooks();
    this.createHealthBar();
    this.createBackground();
    this.createCursor();
    this.createMobileControls();
    this.createJumpButton();
    this.cameras.main.setBounds(0, 0, this.map.width, this.map.height);
    this.physics.world.setBounds(0, 0, this.map.getBounds().width,
      this.map.height + this.player.height);
    this.cameras.main.startFollow(this.player, true, 0.5, 0.5, 0, 180);

    this.createTimer();
    this.gameTimer = this.time.delayedCall(100, this.updateTimer, [], this);

    this.scoreText = this.add.text(16, 20, 'score: 0', {
      fontFamily: 'Lato, sans-serif', fontSize: this.fontSize, fill: '#000', wordWrap: true, wordWrapWidth: this.player.width, align: 'center',
    });
    this.scoreText.setScrollFactor(0);
  }

  createTimer() {
    this.timeLabel = this.add.text(395, 37, '00:00', {
      fontFamily: 'Lato, sans-serif', fontSize: this.fontSize, fill: '#000', wordWrap: true, wordWrapWidth: this.player.width, align: 'center',
    });
    this.timeLabel.setScrollFactor(0);
    this.timeLabel.setOrigin(0.5);
    this.timeLabel.setDepth(5);
  }

  updateTimer() {
    const currentTime = new Date();
    const timeDifference = this.startTime.getTime() - currentTime.getTime();

    // Time elapsed in seconds
    this.timeElapsed = Math.abs(timeDifference / 1000);

    // Convert seconds into minutes and seconds
    const minutes = Math.floor(this.timeElapsed / 60);
    const seconds = Math.floor(this.timeElapsed) - (60 * minutes);

    // Display minutes, add a 0 to the start if less than 10
    let result = (minutes < 10) ? `0 ${minutes}` : minutes;

    // Display seconds, add a 0 to the start if less than 10
    result += (seconds < 10) ? `:0 ${seconds}` : `: ${seconds}`;

    this.timeLabel.text = result;
    this.curTime = result;
  }

  createHealthBar() {
    this.add.rectangle(720, 36, 124, 24, '0x000000').setDepth(5).setScrollFactor(0);
    this.healthBar = this.add.rectangle(720, 36, 120, 20, '0xcc0000');
    this.healthBar.setDepth(6);
    this.healthBar.setScrollFactor(0);
  }

  createBackground() {
    this.map = this.add.image(0, 0, 'background');
    this.map.setDepth(2);
    this.map.setOrigin(0, 0.05);

    this.middle = this.add.image(0, 0, 'middle');
    this.middle.setDepth(1);
    this.middle.setOrigin(0, 0.05);

    this.sky = this.add.image(0, 0, 'sky');
    this.sky.setDepth(0);
    this.sky.setOrigin(0, 0);

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
    this.groundGroup = this.physics.add.staticGroup();
    this.ground = this.groundGroup.create(400, 600, 'ground');
    this.ground.setDepth(3);
    this.ground.setScale(2);
    this.ground.setSize(4200, 63);
    this.ground.setOffset(0, -8);
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
      child.setSize(15, 230);
      child.setOffset(56, 35);
      this.physics.add.overlap(child, this.player, this.detectOverlap, false, this);
    });
  }

  createGoal() {
    this.goal = this.physics.add.image(1850, 400, 'goal');
    this.goal.setDepth(4);
    this.goal.setOffset(90, 0);
    this.physics.add.collider(this.goal, this.ground);
    this.physics.add.overlap(this.player, this.goal, this.touchGoal, false, this);
  }

  createPlayer() {
    this.player = this.physics.add.sprite(100, 500, 'dude');
    this.player.setSize(18, 34);
    this.player.setOffset(2, 4);
    this.player.setScale(1.5);
    this.player.setBounce(0.2);
    this.player.setGravityY(300);
    this.player.setDepth(5);
    this.player.setCollideWorldBounds(true);
    this.physics.add.collider(this.player, this.platforms);
    this.physics.add.collider(this.player, this.ground);
  }

  createEnemies() {

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
        onRepeat: () => {
          const curX = child.x - 20;
          const curY = child.y;
          this.nut = this.physics.add.image(curX, curY, 'nut');
          this.nut.setBounce(1);
          this.nut.setDepth(6);
          this.nut.setVelocityY(80).setVelocityX(-350);
          this.physics.add.collider(this.player, this.nut, this.hitNut, null, this);
        },
      });
    }
  }

  createCursor() {
    this.cursors = this.input.keyboard.createCursorKeys();
  }

  createMobileControls() {
    this.space = this.add.image(250, 560, 'space');
    this.space.setDepth(6).setInteractive().setScrollFactor(0);
    this.space.on('pointerdown', () => {
      this.player.setVelocityY(-355);
    });

    this.right = this.add.image(650, 560, 'right');
    this.right.setDepth(6).setInteractive().setScrollFactor(0);
    this.right.on('pointerdown', () => {
      this.moveRight = true;
    }, this);
    this.right.on('pointerup', () => {
      this.moveRight = false;
    }, this);

    this.left = this.add.image(550, 560, 'left');
    this.left.setDepth(6).setInteractive().setScrollFactor(0);
    this.left.on('pointerdown', () => {
      this.moveLeft = true;
    }, this);
    this.left.on('pointerup', () => {
      this.moveLeft = false;
    }, this);

    this.up = this.add.image(600, 510, 'up');
    this.up.setDepth(6).setInteractive().setScrollFactor(0);
    this.up.on('pointerdown', () => {
      this.moveUp = true;
    }, this);
    this.up.on('pointerup', () => {
      this.moveUp = false;
    }, this);

    this.down = this.add.image(600, 560, 'down');
    this.down.setDepth(6).setInteractive().setScrollFactor(0);
    this.down.on('pointerdown', () => {
      this.moveDown = true;
    }, this);
    this.down.on('pointerup', () => {
      this.moveDown = false;
    }, this);
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
    this.booksNum += 1;
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
        this.callGameOver(player);
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
    if (player.y < (enemy.y - (enemy.displayHeight - 10))) {
      enemy.body.velocity.x = 0;
      enemy.y += 50;
      this.tweens.killTweensOf(enemy);
      // enemy.destroy();
      player.y -= 30;
      this.score += 100;
      this.scoreText.setText(`Score: ${this.score}`);
    } else {
      this.callGameOver(player);
    }
  }

  touchGoal() {
    if (!this.fadeTriggered) {
      this.fadeTriggered = true;
      this.cameras.main.fadeOut(1000, 255, 255, 255, () => {
        this.cameras.main.on('camerafadeoutcomplete', () => {
          this.scene.start('scene2', { score: this.score, time: this.timeElapsed, books: this.booksNum });
        }, this);
      });
    }
  }

  callGameOver(player) {
    this.healthBar.setSize(0, 20);
    player.setTint(0xff0000);
    player.anims.play('turn');
    // this.anims.pauseAll();
    this.physics.pause();
    // this.tweens.pauseAll();
    this.cameras.main.shake(100, 0.01);
    this.gameOver = true;

    if (!this.fadeTriggered) {
      this.fadeTriggered = true;
      this.cameras.main.fadeOut(800, 255, 255, 255, () => {
        this.cameras.main.on('camerafadeoutcomplete', () => {
          this.scene.start('gameover', { score: this.score, time: this.curTime });
        }, this);
      });
    }
  }

  // ========================================================
  // Update

  update() {
    if (this.gameOver) {
      return;
    }

    this.updateTimer();

    if (this.cursors.left.isDown || this.moveLeft) {
      this.player.setVelocityX(-100);
      this.player.x -= 2.5;

      this.player.anims.play('left', true);
    } else if (this.cursors.right.isDown || this.moveRight) {
      this.player.setVelocityX(100);
      this.player.x += 2.5;
      this.player.anims.play('right', true);
    } else if ((this.cursors.up.isDown && onLadder === true) || (this.moveUp && onLadder === true)) {
      this.player.setGravityY(0);
      this.player.setVelocityY(-100);
      this.player.anims.play('climb', true);
      onLadder = false;
    } else if ((this.cursors.down.isDown && onLadder === true) || (this.moveDown && onLadder === true)) {
      this.player.setGravityY(0);
      this.player.setVelocityY(100);
      this.player.anims.play('climb', true);
      onLadder = false;
    } else {
      this.player.anims.play('turn');
      this.player.setGravityY(300);
      this.player.setVelocityX(0);
    }

    if (this.jumpButton.isDown && (this.player.body.onFloor() || this.player.body.touching.down)) {
      this.player.setVelocityY(-355);
    } else {
      if (onLadder === true && (this.player.y + this.player.height) < (this.ground.y - 20)) {
        this.player.setGravityY(-5);
        this.player.setVelocityY(-5);
        if (this.jumpButton.isDown && this.player.y < (this.ladders.children.entries[0].y + 20)) {
          this.player.setVelocityY(-355);
        }
        this.player.anims.play('back', true);
        onLadder = false;
      } else {
        this.player.setGravityY(300);
      }
    }
  }
}

export default Scene1;
