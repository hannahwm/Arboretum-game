import Phaser, { Scene } from 'phaser';
import gameConfig from './gameConfig';

let onLadder = false;

class Scene2 extends Scene {

  constructor() {
    super('scene2'); // key: scene1
    this.startTime = new Date();
    // this.onLadder = false;
    // this.isClimbing = false;
  }

  // this is where data is carried over from the previous level
  init(data) {
    this.score = data.score;
    this.timeElapsed = data.time;
    this.booksNum = data.books;
  }

  create() {
    this.fadeTriggered = false;
    this.gameOver = false;
    this.curTime = this.timeElapsed;

    this.cameras.main.setBackgroundColor('#C9E9F0');
    this.cameras.main.fadeIn(2000, 255, 255, 255);

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
    this.createJumpButton();
    this.cameras.main.setBounds(0, 0, this.map.width, this.map.height);
    this.physics.world.setBounds(0, 0, this.map.getBounds().width,
      this.map.height + this.player.height);
    this.cameras.main.startFollow(this.player, true, 0.5, 0.5, 0, 180);

    this.createTimer();
    this.gameTimer = this.time.delayedCall(100, this.updateTimer, [], this);

    this.scoreText = this.add.text(16, 20, `score: ${this.score}`, {
      fontFamily: 'Lato, sans-serif', fontSize: '20px', fill: '#000', wordWrap: true, wordWrapWidth: this.player.width, align: 'center',
    });
    this.scoreText.setScrollFactor(0);
  }

  createTimer() {
    this.timeLabel = this.add.text(395, 37, this.timeElapsed, {
      fontFamily: 'Lato, sans-serif', fontSize: '20px', fill: '#000', wordWrap: true, wordWrapWidth: this.player.width, align: 'center',
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
    this.map = this.add.image(0, 0, 'background2');
    this.map.setDepth(2);
    this.map.setOrigin(0, 0.05);

    this.middle = this.add.image(0, 0, 'middle2');
    this.middle.setDepth(1);
    this.middle.setOrigin(0, 0.05);

    this.sky = this.add.image(0, 0, 'sky2');
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
    this.platforms.create(340, 460, 'platform');
    // platform 2
    this.platforms.create(740, 460, 'platform');
    // platform 3
    this.platforms.create(1040, 360, 'platform');
    // platform 4
    this.platforms.create(1220, 480, 'platform');

    this.platforms.children.iterate((child) => {
      child.setSize(160, 33);
      child.setOffset(0, 7);
    });

    this.platforms.setDepth(6);
  }

  createLadders() {
    this.ladders = this.physics.add.staticGroup();
    this.ladders.create(530, 440, 'ladder');
    this.ladders.setDepth(4);
    this.physics.add.overlap(this.player, this.ladders, this.detectOverlap);

    this.ladders.children.iterate((child) => {
      child.setSize(40, 230);
      child.setOffset(45, 35);
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
    // this.physics.add.overlap(this.player, this.goal, this.touchGoal, false, this);
  }

  createEnemies() {
    this.enemies = this.add.group();
    this.enemiesReverse = this.add.group();
    this.enemiesFloat = this.add.group();

    const enemy1 = this.physics.add.sprite(400, 410, 'squirrel').setDepth(5).setFlipX(true);
    const enemy2 = this.physics.add.sprite(700, 410, 'squirrel').setDepth(5);
    const enemy3 = this.physics.add.sprite(1180, 340, 'squirrel').setDepth(5);
    const enemy4 = this.physics.add.sprite(900, 430, 'pigeon').setDepth(5);
    const enemy5 = this.physics.add.sprite(1490, 520, 'pigeon').setDepth(5);


    this.enemies.addMultiple([enemy2, enemy3], true);
    this.enemiesReverse.addMultiple([enemy1], true);
    this.enemiesFloat.addMultiple([enemy4, enemy5], true);

    for (let i = 0; i < this.enemies.children.size; i += 1) {
      const child = this.enemies.children.entries[i];

      child.setDepth(5).setGravityY(300).setCircle(24, -2, 1);
      child.anims.play('squirrel');
      this.physics.add.collider(this.player, child, this.touchEnemy, null, this);
      this.physics.add.collider(child, this.platforms);

      this.squirrelTween = this.tweens.add({
        targets: child,
        x: child.x + 70,
        ease: 'Power0',
        duration: 1700,
        flipX: true,
        yoyo: true,
        repeat: -1,
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

    for (let i = 0; i < this.enemiesReverse.children.size; i += 1) {
      const child = this.enemiesReverse.children.entries[i];

      child.setDepth(5).setGravityY(300).setCircle(24, -2, 1);
      child.anims.play('squirrel');
      this.physics.add.collider(this.player, child, this.touchEnemy, null, this);
      this.physics.add.collider(child, this.platforms);

      this.squirrelTween2 = this.tweens.add({
        targets: child,
        x: child.x - 100,
        ease: 'Power0',
        duration: 2000,
        flipX: true,
        yoyo: true,
        repeat: -1,
        onRepeat: () => {
          const curX = child.x - 20;
          const curY = child.y;
          this.nut = this.physics.add.image(curX, curY, 'nut');
          this.nut.setBounce(1);
          this.nut.setDepth(5);
          this.nut.setVelocityY(80).setVelocityX(350);
          this.physics.add.collider(this.player, this.nut, this.hitNut, null, this);
        },
      });
    }

    for (let i = 0; i < this.enemiesFloat.children.size; i += 1) {
      const child = this.enemiesFloat.children.entries[i];

      child.setDepth(5).setGravityY(-300).setCircle(20, 4, 0);
      child.anims.play('pigeon');
      this.physics.add.collider(this.player, child, this.touchEnemy, null, this);

      this.floatTween = this.tweens.add({
        targets: child,
        y: child.y - 40,
        ease: 'Linear',
        duration: 1000,
        yoyo: true,
        repeat: -1,
      });
    }
  }

  createCursor() {
    this.cursors = this.input.keyboard.createCursorKeys();
  }

  createBooks() {
    this.books = this.physics.add.group({
      key: 'books',
      repeat: 4,
      setXY: { x: 280, y: 300, stepX: 250 },
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

    // if (this.books.countActive(true) === 0) {
    //   this.books.children.iterate((child) => {
    //     child.enableBody(true, child.x, 0, true, true);
    //   });
    // }
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
      if (enemy.anims.currentAnim.key === "pigeon") {
        enemy.y += 150;
      } else {
        enemy.y += 50;
      }
      this.tweens.killTweensOf(enemy);
      // enemy.destroy();
      player.y -= 30;
      this.score += 150;
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
          this.scene.start('winscreen', { score: this.score, time: this.timeElapsed, books: this.booksNum });
        }, this);
      });
    }
  }

  callGameOver(player) {
    this.healthBar.setSize(0, 20);
    player.setTint(0xff0000);
    player.anims.play('turn');
    this.physics.pause();
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

    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-100);
      this.player.x -= 2.5;

      this.player.anims.play('left', true);
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(100);
      this.player.x += 2.5;

      this.player.anims.play('right', true);
    } else if (this.cursors.up.isDown && onLadder === true) {
      this.player.setGravityY(0);
      this.player.setVelocityY(-100);
      this.player.anims.play('climb', true);
      onLadder = false;
    } else if (this.cursors.down.isDown && onLadder === true) {
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

export default Scene2;
