/*
  Part of Kosmud

  Websocket wrapper.
*/


import {ERROR} from '../../Shared/Log/ERROR';
import {Syslog} from '../../Shared/Log/Syslog';
import {Types} from '../../Shared/Utils/Types';
import {MessageType} from '../../Shared/MessageType';
import {WebSocketEvent} from '../../Shared/Net/WebSocketEvent';
import {Connection} from '../../Shared/Net/Connection';

// 3rd party modules.
// Use 'isomorphic-ws' to be able to use the same code
// on both client and server.
import * as WebSocket from 'isomorphic-ws';

export abstract class Socket extends Connection
{
  constructor(private webSocket: WebSocket)
  {
    super();

    this.init();
  }

  // ---------------- Static methods --------------------

  // -------------- Static class data -------------------

  // ---------------- Protected data --------------------

//*
  // We still need this even though WebSocket keeps it's status
  // in .readyState property. The reason is that events don't know
  // what caused them. If for example the websocket server is down
  // and we try to connect to it, an 'error' and a 'close' events
  // are fired after the timeout. In both cases, socket.readyState
  // is set to WebSocket.CLOSED so we have no way to determine
  // if the connection couldn't even be estableshed or if it was
  // opened and then something caused a disconnect.
  //   To solve this, we set 'this.open' to 'true' only when 'open'
  // event is fired. So when the 'error' or 'close' event comes
  // and 'this.wasConnected' is still false, it means failure to
  // connect, otherwise it means a disconnect.
  protected wasConnected = false;

  // ----------------- Private data ---------------------

//*
  // Here we remember event listeners so we can remove them
  // when the socket closes.
  private listeners =
  {
    onopen: <((event: Types.OpenEvent) => void) | null>null,
    onmessage: <((event: Types.MessageEvent) => void) | null>null,
    onerror: <((event: Types.ErrorEvent) => void) | null>null,
    onclose: <((event: Types.CloseEvent) => void) | null>null
  }

  // ----------------- Public data ----------------------

  // ---------------- Public methods --------------------

//*
  public abstract getOrigin(): string;

//*
  public isOpen()
  {
    return this.webSocket.readyState === WebSocket.OPEN;
  }

//*
  public isClosingOrClosed()
  {
    return this.isClosing() || this.webSocket.readyState === WebSocket.CLOSED;
  }

//*
  // ! Throws exception on error.
  public close(reason?: string)
  {
    if (this.isClosingOrClosed())
    {
      throw new Error("Failed to cose socket to " + this.getOrigin() +
          + " because it is already closing or closed");
    }

    this.webSocket.close(WebSocketEvent.NORMAL_CLOSE, reason);
  }

  // --------------- Protected methods ------------------

//*
  // ! Throws exception on error.
  protected sendData(data: string)
  {
    /// DEBUG:
    // console.log("Sending data: " + data);

    if (!this.isOpen())
    {
      throw new Error("Failed to send data to " + this.getOrigin()
        + " because the connection is closed");
    }

    if (this.webSocket)
    {
      try
      {
        this.webSocket.send(data);
      }
      catch (error)
      {
        throw new Error("Failed to send data to " + this.getOrigin() + "."
          + " Reason: " + error.message);
      }
    }
  }

//*
  protected isConnecting()
  {
    return this.webSocket.readyState === WebSocket.CONNECTING;
  }

//*
  protected isClosing()
  {
    return this.webSocket.readyState === WebSocket.CLOSING;
  }
  
  protected logSocketClosingError(event: Types.CloseEvent)
  {
    let message = "Socket to " +  + this.getOrigin() + " closed";

    if (event.reason)
    {
      message += " because of error: " + event.reason;
    }

    message += ". Code: " + event.code + "."
    message += " Description: " + WebSocketEvent.description(event.code);

    Syslog.log
    (
      message,
      MessageType.WEBSOCKET
    );
  }

  // ---------------- Private methods -------------------

//*
  private init()
  {
    // Remember event listeners so we can close them later.
    this.listeners.onopen = (event) => { this.onOpen(event); };
    this.listeners.onmessage = (event) => { this.onMessage(event); };
    this.listeners.onerror = (event) => { this.onError(event); };
    this.listeners.onclose = (event) => { this.onClose(event); };

    // Assign them to the socket.
    this.webSocket.onopen = this.listeners.onopen;
    this.webSocket.onmessage = this.listeners.onmessage;
    this.webSocket.onerror = this.listeners.onerror;
    this.webSocket.onclose = this.listeners.onclose;
  }

//*
  // Removes event handlers from this.socket.
  private cleanup()
  {    
    if (this.listeners.onopen)
      this.webSocket.removeEventListener('open', this.listeners.onopen);

    if (this.listeners.onmessage)
      this.webSocket.removeEventListener('message', this.listeners.onmessage);
    
    if (this.listeners.onerror)
      this.webSocket.removeEventListener('error', this.listeners.onerror);

    if (this.listeners.onclose)
      this.webSocket.removeEventListener('close', this.listeners.onclose);
  }

  // ---------------- Event handlers --------------------

//*
  protected onOpen(event: Types.OpenEvent)
  {
    // 'open' event means that connection has been succesfully
    // established. We remember it so we can later determine
    // if an error means failure to connect or a disconnect.
    this.wasConnected = true;
  }

//*
  private async onMessage(event: Types.MessageEvent)
  {
    if (typeof event.data !== 'string')
    {
      ERROR("Websocket to " + this.getOrigin()
        + " received non-string data. Message"
        + " will not be processed because"
        + " we can only process string data");
      return;
    }

    try
    {
      await this.receiveData(event.data);
    }
    catch (error)
    {
      Syslog.reportUncaughtException(error);
    }
  }

//*
  private onError(event: Types.ErrorEvent)
  {
    // We don't need to close the connection here, because when
    // 'error' event is fired 'close' event is fired as well.
    // So we just log the error.
    let errorOccured = "Socket error occured";

    if (event.message)
    {
      errorOccured += ": " + event.message + ".";
    }
    else
    {
      errorOccured += ".";
    }

    Syslog.log
    (
      errorOccured + " Connection to " + this.getOrigin() + " will close",
      MessageType.WEBSOCKET
    );
  }

  protected onClose(event: Types.CloseEvent)
  {
    this.cleanup();
  }

  // -------------- Protected methods -------------------

}