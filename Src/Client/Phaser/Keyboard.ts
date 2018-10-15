import {Syslog} from '../../Shared/Log/Syslog';
import {KeyboardInput} from '../../Shared/Protocol/KeyboardInput';
import {Connection} from '../../Client/Net/Connection';
import {REPORT} from '../../Shared/Log/REPORT';

/// Návod:
/// http://www.html5gamedevs.com/topic/36693-problems-with-keyboard-events/

export class Keyboard
{
  constructor(private keyboard: Phaser.Input.Keyboard.KeyboardPlugin)
  {
    keyboard.on
    (
      'keydown_A',
      () => { this.onKeydownA(); }
    );

    keyboard.on
    (
      'keyup_A',
      () => { this.onKeyupA(); }
    );

    keyboard.on
    (
      'keydown_D',
      () => { this.onKeydownD(); }
    );

    keyboard.on
    (
      'keyup_D',
      () => { this.onKeyupD(); }
    );

    keyboard.on
    (
      'keydown_S',
      () => { this.onKeydownS(); }
    );

    keyboard.on
    (
      'keyup_S',
      () => { this.onKeyupS(); }
    );

    keyboard.on
    (
      'keydown_W',
      () => { this.onKeydownW(); }
    );

    keyboard.on
    (
      'keyup_W',
      () => { this.onKeyupW(); }
    );


    // this.W = keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    // this.A = keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    // this.S = keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    // this.D = keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);

    // //   // Wire up an event handler for each K.  The handler is a Phaser.Signal attached to the Key Object
    // // this.W.onDown.add(SimpleGame.prototype.moveUp, this);
    // // this.A.onDown.add(SimpleGame.prototype.moveLeft, this);
    // // this.S.onDown.add(SimpleGame.prototype.moveDown, this);
    // // this.D.onDown.add(SimpleGame.prototype.moveRight, this);

    // // Since we are allowing the combination of CTRL+W, which is a shortcut
    // // for close window, we need to trap all handling of the W key and make
    // // sure it doesnt get handled by the browser.  
    // //   Unfortunately you can no longer capture the CTRL+W key combination
    // // in Google Chrome except in "Application Mode" because apparently
    // // Google thought an unstoppable un prompted key combo of death was a good
    // // idea...
    // /// Obviously this doesn't work in Phaser 3...
    // // keyboard.addKeyCapture(Phaser.Keyboard.W);
  }

  // // private W = this.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
  // // private A = this.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
  // // private S = this.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
  // // private D = this.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
  // private W: Phaser.Input.Keyboard.Key;
  // private A: Phaser.Input.Keyboard.Key;
  // private S: Phaser.Input.Keyboard.Key;
  // private D: Phaser.Input.Keyboard.Key;

  private onKeyupA()
  {
    try
    {
      sendKeyboardInput('Left', 'Stop');
    }
    catch (error)
    {
      Syslog.reportUncaughtException(error)
    }
  }

  private onKeydownA()
  {
    try
    {
      sendKeyboardInput('Left', 'Start');
    }
    catch (error)
    {
      Syslog.reportUncaughtException(error)
    }
  }

  private onKeyupD()
  {
    try
    {
      sendKeyboardInput('Right', 'Stop');
    }
    catch (error)
    {
      Syslog.reportUncaughtException(error)
    }
  }

  private onKeydownD()
  {
    try
    {
      sendKeyboardInput('Right', 'Start');
    }
    catch (error)
    {
      Syslog.reportUncaughtException(error)
    }
  }

  private onKeyupS()
  {
    try
    {
      sendKeyboardInput('Backward', 'Stop');
    }
    catch (error)
    {
      Syslog.reportUncaughtException(error)
    }
  }

  private onKeydownS()
  {
    try
    {
      sendKeyboardInput('Backward', 'Start');
    }
    catch (error)
    {
      Syslog.reportUncaughtException(error)
    }
  }

  private onKeyupW()
  {
    try
    {
      sendKeyboardInput('Forward', 'Stop');
    }
    catch (error)
    {
      Syslog.reportUncaughtException(error)
    }
  }

  private onKeydownW()
  {
    try
    {
      sendKeyboardInput('Forward', 'Start');
    }
    catch (error)
    {
      Syslog.reportUncaughtException(error)
    }
  }
}

// ----------------- Auxiliary Functions ---------------------

function sendKeyboardInput
(
  action: KeyboardInput.Action,
  startOrStop: KeyboardInput.StartOrStop
)
{
  /// TODO: All keyboard event handling should be disabled when
  /// the player gets disconnected (reconnect window should be
  /// shown instead).
  ///   For now, we just avoid sending packets to closed connection.
  if (!Connection.isOpen())
    return;

  try
  {
    Connection.send(new KeyboardInput(action, startOrStop));
  }
  catch (error)
  {
    REPORT(error, "Failed to send keyboard input");
  }
}