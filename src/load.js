import Phaser from 'phaser';

const loadScene = {
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

export default load;
