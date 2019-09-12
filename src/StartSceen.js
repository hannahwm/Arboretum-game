import Phaser, { Scene } from 'phaser';

class StartScreen extends Scene {
  constructor() {
    super('startscreen');
  }

  preload() {
    this.load.image('screen', '/interactive/2019/08/phaser-game/assets/title-screen.png');
  }

  create() {
    this.width = this.cameras.main.width;
    this.isSmall = false;
    this.isMedium = false;

    if (this.width < 376) {
      this.isSmall = true;
    } else if (this.width < 700) {
      this.isMedium = true;
    }
    if (this.isSmall) {
      const screen = this.add.image(0, 0, 'screen').setScale(0.4);
      screen.setOrigin(0, 0);
    } else if (this.isMedium) {
      const screen = this.add.image(0, 0, 'screen').setScale(0.5);
      screen.setOrigin(0, 0);
    } else {
      const screen = this.add.image(0, 0, 'screen');
      screen.setOrigin(0, 0);
    }

    this.input.on('pointerdown', () => this.scene.start('instructions', { small: this.isSmall, medium: this.isMedium }));
  }
}

export default StartScreen;
