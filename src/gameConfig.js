import Phaser from 'phaser';
import StartSceen from './StartSceen';
import Instructions from './Instructions';
import PreloadScene from './PreloadScene';
import Scene1 from './Scene1';
import Scene2 from './Scene2';
import GameOverScreen from './GameOverScreen';
import WinScreen from './WinScreen';

const $ = jQuery;

let winWidth;
let winHeight;

if ($(window).width() < 376) {
  winWidth = 320;
  winHeight = 240;
} else if ($(window).width() < 700) {
  winWidth = 400;
  winHeight = 300;
} else {
  winWidth = 800;
  winHeight = 600;
}


const gameConfig = {
  type: Phaser.AUTO,
  // domCreateContainer: true,
  parent: 'game-container',
  width: winWidth,
  height: winHeight,
  // scale: {
  //   mode: Phaser.Scale.FIT,
  //   autoCenter: Phaser.Scale.CENTER_BOTH,
  // },
  // StartSceen, Instructions, PreloadScene,
  scene: [PreloadScene, Scene1, Scene2, GameOverScreen, WinScreen],
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 300 },
      debug: false,
    },
  },
};

export default gameConfig;
