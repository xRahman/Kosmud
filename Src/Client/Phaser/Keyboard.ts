
export class Keyboard
{
  constructor(private keyboard: Phaser.Input.Keyboard.KeyboardPlugin)
  {
    this.W = keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    this.A = keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.S = keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    this.D = keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);

    //   // Wire up an event handler for each K.  The handler is a Phaser.Signal attached to the Key Object
    // this.W.onDown.add(SimpleGame.prototype.moveUp, this);
    // this.A.onDown.add(SimpleGame.prototype.moveLeft, this);
    // this.S.onDown.add(SimpleGame.prototype.moveDown, this);
    // this.D.onDown.add(SimpleGame.prototype.moveRight, this);

    // Since we are allowing the combination of CTRL+W, which is a shortcut
    // for close window, we need to trap all handling of the W key and make
    // sure it doesnt get handled by the browser.  
    //   Unfortunately you can no longer capture the CTRL+W key combination
    // in Google Chrome except in "Application Mode" because apparently
    // Google thought an unstoppable un prompted key combo of death was a good
    // idea...
    /// Obviously this doesn't work in Phaser 3...
    // keyboard.addKeyCapture(Phaser.Keyboard.W);
  }

  // private W = this.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
  // private A = this.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
  // private S = this.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
  // private D = this.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
  private W: Phaser.Input.Keyboard.Key;
  private A: Phaser.Input.Keyboard.Key;
  private S: Phaser.Input.Keyboard.Key;
  private D: Phaser.Input.Keyboard.Key;
}
