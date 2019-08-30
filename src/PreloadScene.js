import Phaser, { Scene } from 'phaser';

class PreloadScene extends Scene {
  constructor() {
    super('preload'); // key: preload
  }

  preload() {
    this.load.image('logo', '/interactive/2019/08/phaser-game/assets/logo.png');
  }

  create() {
    this.cameras.main.setBackgroundColor('#ade6ff');
    this.cameras.main.fadeIn(2000, 255, 255, 255);
    const logo = this.add.image(400, 300, 'logo');
    logo.setDepth(1);
    this.input.on('pointerdown', () => this.scene.start('scene1'));
  }
}

export default PreloadScene;
