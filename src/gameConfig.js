import Phaser from 'phaser';
import PreloadScene from './PreloadScene';
import Scene1 from './Scene1';
import Scene2 from './Scene2';

const gameConfig = {
  type: Phaser.AUTO,
  domCreateContainer: true,
  parent: 'game-container',
  width: 800,
  height: 600,
  // PreloadScene
  scene: [Scene1, Scene2],
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 300 },
      debug: true,
    },
  },
};

export default gameConfig;
