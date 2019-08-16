import Phaser, { Scene } from 'phaser';

class Scene1 extends Scene {
  constructor() {
    super('scene1'); // key: scene1

    this.score = 0;
    this.gameOver = false;
    this.onLadder = false;
    this.isClimbing = false;
  }

  preload() {
    this.load.image('sky', 'interactive/2019/08/phaser-game/assets/sky.png');
    this.load.image('ground', 'interactive/2019/08/phaser-game/assets/ground.png');
    this.load.image('platform', 'interactive/2019/08/phaser-game/assets/platform.png');
    this.load.image('ladder', 'interactive/2019/08/phaser-game/assets/ladder.png');
    this.load.image('background', 'interactive/2019/08/phaser-game/assets/background.png');
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
    this.cameras.main.setBounds(0, 0, 1024, 2048);

    this.scoreText = this.add.text(16, 200, 'score: 0', { fontSize: '32px', fill: '#000' });
  }

  createBackground() {
    this.map = this.add.image(0, 0, 'background').setOrigin(0).setScrollFactor(1);
    this.map.setDepth(0);
  }

  createGround() {
    this.ground = this.physics.add.staticGroup();
    this.ground.create(400, 680, 'ground');
    this.ground.setDepth(1);
  }

  createPlatforms() {
    this.platforms = this.physics.add.staticGroup();
    this.platforms.create(480, 540, 'platform');
    this.platforms.setDepth(3);

    this.platforms.children.iterate((child) => {
      child.setSize(160, 33);
      child.setOffset(0, 7);
    });
  }

  createLadders() {
    this.ladders = this.physics.add.staticGroup();
    this.ladders.create(300, 510, 'ladder');
    this.ladders.setDepth(1);
  }


  createPlayer() {
    this.player = this.physics.add.sprite(100, 610, 'dude');
    this.player.setSize(25, 40);
    this.player.setOffset(3, 7);
    this.player.setBounce(0.2);
    this.player.setGravityY(300);
    this.player.setDepth(2);
    this.physics.add.collider(this.player, this.platforms);
    this.physics.add.collider(this.player, this.ground);
    this.physics.add.overlap(this.player, this.ladders, this.detectOverlap);
    this.cameras.main.startFollow(this.player, true, 0.09, 0.09, 0, 180);


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

    this.enemy = this.add.sprite(420, 508, 'squirrel').play('squirrel');
    this.enemy.setDepth(2);

    const tween = this.tweens.add({
      targets: this.enemy,
      x: 540,
      ease: 'Power0',
      duration: 3000,
      flipX: true,
      yoyo: true,
      repeat: -1,
    });
  }

  createCursor() {
    this.cursors = this.input.keyboard.createCursorKeys();
  }

  createJumpButton() {
    this.jumpButton = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
  }

  detectOverlap() {
    this.onLadder = true;
    console.log(`detect on ladder ${this.onLadder}`);
  }

  // ========================================================
  // Update

  update() {
    console.log(`update on ladder ${this.onLadder}`);
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

    if (this.cursors.up.isDown && this.onLadder === true) {
      console.log('attempting climbing');
      if (!this.isClimbing) {
        this.player.setGravityY(0);
        this.player.anims.play('turn', true);
        this.player.setVelocityY(-160);
        this.isClimbing = true;
        console.log('not climbing');
      } else {
        this.player.setGravityY(300);
        this.player.setVelocityY(0);
        this.isClimbing = false;
        console.log('climbing');
      }
    } else {
      this.player.setGravityY(300);
    }

    // jumping
    if (this.jumpButton.isDown && (this.player.body.onFloor() || this.player.body.touching.down)) {
      this.player.setVelocityY(-250);
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
