import Phaser from 'phaser';
import PreloadScene from './PreloadScene';
import Scene1 from './Scene1';

const gameConfig = {
  type: Phaser.AUTO,
  domCreateContainer: true,
  parent: 'game-container',
  width: 800,
  height: 600,
  // PreloadScene
  scene: [Scene1],
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 300 },
      debug: false,
    },
  },
};

export default gameConfig;
