import Phaser, { Scene } from 'phaser';
import gameConfig from './gameConfig';

let onLadder = false;
let hitBoss = false;

class Scene3 extends Scene {

  constructor() {
    super('scene3'); // key: scene1
    this.startTime = new Date();
    // this.onLadder = false;
    // this.isClimbing = false;
  }

  // this is where data is carried over from the previous level
  init(data) {
    this.score = data.score;
    this.timeElapsed = data.time;
    this.booksNum = data.books;
    this.hasTouch = data.touch;
  }

  create() {
    this.fadeTriggered = false;
    this.gameOver = false;
    this.curTime = this.timeElapsed;

    this.cameras.main.setBackgroundColor('#C9E9F0');
    this.cameras.main.fadeIn(2000, 255, 255, 255);
    this.moveRight = false;
    this.moveLeft = false;
    this.moveUp = false;
    this.moveDown = false;
    this.isSwiping = false;
    this.pointerDown = false;

    this.createGround();
    this.createPlatforms();
    this.createPlayer();
    this.createLadders();
    this.createGoal();
    this.createEnemies();
    this.createPond();
    this.createBooks();
    this.createHealthBar();
    this.createBossHealth();
    this.createBackground();
    this.createCursor();
    if (this.hasTouch) {
      this.createMobileControls();
    }
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

  createBossHealth() {
    this.bossHealthRect = this.add.rectangle(1280, 410, 64, 14, '0x000000').setDepth(5);
    this.bossHealth = this.add.rectangle(1280, 410, 60, 10, '0xcc0000');
    this.bossHealth.setDepth(6);

    this.bossHealthTween = this.tweens.add({
      targets: [this.bossHealth, this.bossHealthRect],
      x: this.bossHealth.x + 100,
      ease: 'Linear',
      duration: 2500,
      yoyo: true,
      repeat: -1,
    });
  }

  createBackground() {
    this.map = this.add.image(0, 0, 'background3');
    this.map.setDepth(2);
    this.map.setOrigin(0, 0.05);

    // this.middle = this.add.image(0, 0, 'middle');
    // this.middle.setDepth(1);
    // this.middle.setOrigin(0, 0.05);

    this.sky = this.add.image(0, 0, 'sky2');
    this.sky.setDepth(0);
    this.sky.setOrigin(0, 0);

    const gameWidth = parseFloat(this.map.getBounds().width);
    const windowWidth = gameConfig.width;
    const bgWidth = this.map.getBounds().width;
    // const middleWidth = this.middle.getBounds().width;
    const skyWidth = this.sky.getBounds().width;

    this.map.setScrollFactor((bgWidth - windowWidth) / (gameWidth - windowWidth));
    // this.middle.setScrollFactor((middleWidth - windowWidth) / (gameWidth - windowWidth));
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
    this.platforms.create(340, 490, 'platform');
    // platform 2
    this.platforms.create(650, 440, 'platform');
    // platform 3
    this.platforms.create(1000, 360, 'platform');
    // platform 4
    // this.platforms.create(1220, 480, 'platform');

    this.platforms.children.iterate((child) => {
      child.setSize(160, 33);
      child.setOffset(0, 7);
    });

    this.platforms.setDepth(6);
  }

  createLadders() {
    this.ladders = this.physics.add.staticGroup();
    this.ladders.create(1500, 440, 'ladder');
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
    if (this.hasTouch) {
      this.player.x = 250;
    }
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

  createPond() {
    this.pond = this.physics.add.staticGroup();
    this.pond.create(850, 578, 'pond').setScale(1.2);
    this.pond.children.iterate((child) => {
      child.setDepth(4);
      // child.setSize(200, 20);
      child.setOffset(-50, 0);
    });

    this.bridge = this.physics.add.staticGroup();
    this.bridge.create(850, 578, 'bridge').setScale(1.2);
    this.bridge.children.iterate((child) => {
      child.setDepth(7);
    });
  }

  createEnemies() {
    this.enemies = this.add.group();
    this.enemiesReverse = this.add.group();
    this.enemiesBoss = this.add.group();

    const enemy1 = this.physics.add.sprite(400, 410, 'squirrel').setDepth(5).setFlipX(true);
    const enemy2 = this.physics.add.sprite(630, 360, 'squirrel').setDepth(5);
    const enemy3 = this.physics.add.sprite(980, 300, 'squirrel').setDepth(5);
    const enemy4 = this.physics.add.sprite(1260, 500, 'boss');


    this.enemies.addMultiple([enemy2, enemy3], true);
    this.enemiesReverse.addMultiple([enemy1], true);
    this.enemiesBoss.addMultiple([enemy4], true);

    for (let i = 0; i < this.enemies.children.size; i += 1) {
      const child = this.enemies.children.entries[i];

      child.setDepth(5).setGravityY(300).setSize(26, 45);
      child.anims.play('squirrel');
      this.physics.add.collider(this.player, child, this.touchEnemy, null, this);
      this.physics.add.collider(child, this.platforms);

      this.squirrelTween = this.tweens.add({
        targets: child,
        x: child.x + 70,
        ease: 'Power0',
        duration: 1000,
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

      child.setDepth(5).setGravityY(300).setSize(26, 45);
      child.anims.play('squirrel');
      this.physics.add.collider(this.player, child, this.touchEnemy, null, this);
      this.physics.add.collider(child, this.platforms);

      this.squirrelTween2 = this.tweens.add({
        targets: child,
        x: child.x - 100,
        ease: 'Power0',
        duration: 1500,
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

    for (let i = 0; i < this.enemiesBoss.children.size; i += 1) {
      const child = this.enemiesBoss.children.entries[i];
      child.setDepth(6).setSize(110, 145);
      child.anims.play('boss');
      this.physics.add.collider(this.player, child, this.touchBoss, null, this);
      this.physics.add.collider(child, this.ground);

      this.bossTween = this.tweens.add({
        targets: child,
        x: child.x + 100,
        ease: 'Linear',
        duration: 2500,
        flipX: true,
        yoyo: true,
        repeat: -1,
        onRepeat: () => {
          const curX = child.x - 20;
          const curY = child.y;
          this.nut = this.physics.add.image(curX, curY, 'nut');
          this.physics.add.collider(this.nut, this.ground).name = 'nutCollider';
          // this.nut.setBounce(1);
          this.nut.setDepth(5).setScale(1.5);
          this.nut.setVelocityY(80).setVelocityX(-150).setAngularAcceleration(-500);
          this.physics.add.overlap(this.pond, this.nut, this.hitPond, null, this);
          this.physics.add.collider(this.player, this.nut, this.hitNut, null, this);
        },
      });
    }
  }

  createCursor() {
    this.cursors = this.input.keyboard.createCursorKeys();
  }

  createMobileControls() {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    this.space = this.add.image(width * 0.9, height * 0.9, 'jump');
    this.space.setDepth(6).setInteractive().setScrollFactor(0);
    this.space.on('pointerdown', () => {
      this.player.setVelocityY(-355);
    });

    this.right = this.add.image(180, height * 0.9, 'right');
    this.right.setDepth(6).setInteractive().setScrollFactor(0);
    this.right.on('pointerdown', () => {
      this.moveRight = true;
    }, this);
    this.right.on('pointerup', () => {
      this.moveRight = false;
    }, this);
    this.right.on('pointerout', () => {
      this.moveRight = false;
    }, this);

    this.left = this.add.image(50, height * 0.9, 'left');
    this.left.setDepth(6).setInteractive().setScrollFactor(0);
    this.left.on('pointerdown', () => {
      this.moveLeft = true;
    }, this);
    this.left.on('pointerup', () => {
      this.moveLeft = false;
    }, this);
    this.left.on('pointerout', () => {
      this.moveLeft = false;
    }, this);

    this.up = this.add.image(115, height * 0.77, 'up');
    this.up.setDepth(6).setInteractive().setScrollFactor(0);
    this.up.on('pointerdown', () => {
      this.moveUp = true;
    }, this);
    this.up.on('pointerup', () => {
      this.moveUp = false;
    }, this);
    this.up.on('pointerout', () => {
      this.moveUp = false;
    }, this);
  }

  createBooks() {
    this.books = this.physics.add.group({
      key: 'books',
      repeat: 3,
      setXY: { x: 350, y: 160, stepX: 300 },
    });
    this.books.children.iterate((child) => {
      child.setDepth(4);
    });

    this.finalBooks = this.physics.add.group();
    this.finalBooks.create(1280, 440, 'books');
    this.finalBooks.children.iterate((child) => {
      child.setDepth(4);
    });


    this.physics.add.collider(this.books, this.platforms);
    this.physics.add.collider(this.books, this.ladders);
    this.physics.add.collider(this.finalBooks, this.ground);
    this.physics.add.overlap(this.player, this.books, this.collectBooks, null, this);
    this.physics.add.overlap(this.player, this.finalBooks, this.collectFinalBooks, null, this);
  }

  collectBooks(player, books) {
    books.disableBody(true, true);

    this.score += 10;
    this.scoreText.setText(`Score: ${this.score}`);
    this.booksNum += 1;
  }

  collectFinalBooks(player, finalbooks) {
    finalbooks.disableBody(true, true);
    this.score += 100;
    this.scoreText.setText(`Score: ${this.score}`);
    this.booksNum += 10;
  }

  createJumpButton() {
    this.jumpButton = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
  }

  hitNut(player, nut) {
    const curWidth = this.healthBar.displayWidth;
    player.setTint(0xff0000);
    this.cameras.main.shake(100, 0.01);
    nut.destroy();

    setTimeout(() => {
      if (curWidth === 20) {
        this.callGameOver(player);
      } else {
        this.healthBar.setSize(curWidth - 20, 20);
        player.clearTint();
      }
    }, 200);
  }

  hitPond(nut) {
    nut.setVelocityX(-50);
    nut.setGravityY(100);
    this.physics.world.colliders.remove(this.physics.world.colliders.getActive().find((i) => {
      return i.name === 'nutCollider';
    }));
    setTimeout(() => {
      nut.destroy();
    }, 300);
  }

  detectOverlap() {
    onLadder = true;
  }

  touchEnemy(player, enemy) {
    if (enemy.body.touching.up && player.body.touching.down) {
      enemy.body.velocity.x = 0;
      enemy.y += 50;
      this.tweens.killTweensOf(enemy);
      // enemy.destroy();
      player.y -= 30;
      this.score += 100;
      this.scoreText.setText(`Score: ${this.score}`);
    } else {
      const curWidth = this.healthBar.displayWidth;
      player.setTint(0xff0000);
      this.cameras.main.shake(100, 0.01);

      setTimeout(() => {
        if (curWidth <= 40) {
          this.callGameOver(player);
        } else {
          this.healthBar.setSize(curWidth - 40, 20);
          player.clearTint();
        }
      }, 200);

      if (player.x < enemy.x) {
        player.x -= 30;
      } else {
        player.x += 30;
      }
    }
  }

  touchBoss(player, boss) {
    const curWidth = this.bossHealth.displayWidth;

    if (boss.body.touching.up && player.body.touching.down) {
      player.y -= 100;
      if (hitBoss === false) {
        hitBoss = true;
        boss.setTint(0xff0000);
        boss.body.velocity.x = 0;

        if (boss.anims.forward === false) {

          // block.x = player.x + 100;
          // block.y = player.y - 100;
          // this.physics.moveToObject(player, block, 200);
          player.x += 100;
          // player.y -= 100;
          // this.player.setVelocityX(100);
          // player.body.velocity.x = 300;
          // this.player.setVelocityY(-100);
        } else {
          player.x -= 100;
          // boss.x += 30;
          // this.player.body.velocity.y = -150;
          // this.player.body.velocity.x = -150;
          // this.player.setVelocityX(+150);
          // this.player.setVelocityY(+150);
          // player.body.velocity.x = -300;
          // player.setVelocityX(-150)
        }

        if (curWidth === 20) {
          // boss.body.velocity.x = 0;
          boss.y += 50;
          this.bossHealth.y += 200;
          this.bossHealthRect.y += 200;
          this.tweens.killTweensOf(boss);
          this.score += 500;
          this.scoreText.setText(`Score: ${this.score}`);
        } else {
          this.bossHealth.setSize(curWidth - 20, 10);
        }
      }

      setTimeout(() => {
        hitBoss = false;
        boss.clearTint();
      }, 1000);


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
      if (this.isSwiping === false && (this.player.body.onFloor() || this.player.body.touching.down)) {
        this.player.anims.play('turn');
        this.player.setVelocityX(0);
      } else {
        this.player.setGravityY(300);
      }
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

export default Scene3;
