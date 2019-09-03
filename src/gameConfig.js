import Phaser from 'phaser';
import StartSceen from './StartSceen';
import PreloadScene from './PreloadScene';
import Scene1 from './Scene1';
import Scene2 from './Scene2';

const gameConfig = {
  type: Phaser.AUTO,
  domCreateContainer: true,
  parent: 'game-container',
  width: 800,
  height: 600,
  // StartSceen, PreloadScene,
  scene: [PreloadScene, Scene1, Scene2],
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 300 },
      debug: false,
    },
  },
};

export default gameConfig;
