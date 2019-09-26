import Phaser from 'phaser';
import StartSceen from './StartSceen';
import Instructions from './Instructions';
import InstructionsTouch from './InstructionsTouch';
import PreloadScene from './PreloadScene';
import Scene1 from './Scene1';
import Scene2 from './Scene2';
import Scene3 from './Scene3';
import GameOverScreen from './GameOverScreen';
import WinScreen from './WinScreen';

// const $ = jQuery;
//
// let winWidth;
// let winHeight;
//
// if ($(window).width() < 376) {
//   winWidth = 320;
//   winHeight = 240;
// } else if ($(window).width() < 700) {
//   winWidth = 400;
//   winHeight = 300;
// } else {
//   winWidth = 800;
//   winHeight = 600;
// }


const gameConfig = {
  type: Phaser.AUTO,
  // domCreateContainer: true,
  parent: 'game-container',
  width: 800,
  height: 600,
  scale: {
    mode: Phaser.Scale.SMOOTH,
    width: 800,
    height: 600,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  // StartSceen, Instructions, InstructionsTouch, PreloadScene,
  scene: [PreloadScene, Scene1, Scene2, Scene3, GameOverScreen, WinScreen],
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 300 },
      debug: true,
    },
  },
  input: {
    activePointers: 3,
  },
};

export default gameConfig;
