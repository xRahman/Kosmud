/*
  Part of Kosmud

  Websocket wrapper.
*/

import {ERROR} from '../../Shared/Log/ERROR';
import {Syslog} from '../../Shared/Log/Syslog';
import {Types} from '../../Shared/Utils/Types';
import {WebSocketEvent} from '../../Shared/Net/WebSocketEvent';
import {PacketHandler} from '../../Shared/Net/PacketHandler';

// 3rd party modules.
// Use 'isomorphic-ws' to use the same code on both client and server.
import * as WebSocket from 'isomorphic-ws';

export abstract class Socket extends PacketHandler
{
  constructor(private webSocket: WebSocket)
  {
    super();

    this.init();
  }

  // ---------------- Protected data --------------------

  // This is used to determine if a socket error means that
  // we have been disconnected or that connection couldn't
  // even be established.
  protected wasConnected = false;

  // ----------------- Private data ---------------------

  // We remember event listeners so we can remove them
  // when the socket closes.
  private listeners =
  {
    onopen: <((event: Types.OpenEvent) => void) | null>null,
    onmessage: <((event: Types.MessageEvent) => void) | null>null,
    onerror: <((event: Types.ErrorEvent) => void) | null>null,
    onclose: <((event: Types.CloseEvent) => void) | null>null
  }

  // ---------------- Public methods --------------------

  public abstract getOrigin(): string;

  public isOpen()
  {
    // Note that testing 'readyState === WebSocket.CLOSED' isn't
    // the same as 'readyState !== WebSocket.OPEN'. There are also
    // CONNECTING and CLOSING ready states.
    return this.webSocket.readyState === WebSocket.OPEN;
  }

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

  // ! Throws exception on error.
  protected sendData(data: string)
  {
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

  protected logSocketClosingError(event: Types.CloseEvent)
  {
    let message = "Socket to " + this.getOrigin() + " closed";

    if (event.reason)
    {
      message += " because of error: " + event.reason;
    }

    message += ". Code: " + event.code + "."
    message += ' Description: "' + WebSocketEvent.description(event.code) + '"';

    Syslog.log("[WEBSOCKET]", message);
  }

  // ---------------- Private methods -------------------

  private init()
  {
    this.listeners.onopen = this.registerOpenEvent();
    this.listeners.onmessage = this.registerMessageEvent();
    this.listeners.onerror = this.registerErrorEvent();
    this.listeners.onclose = this.registerCloseEvent();
  }

  private registerOpenEvent()
  {
     return this.webSocket.onopen = (event) => { this.onOpen(event); };
  }

  private registerMessageEvent()
  {
     return this.webSocket.onmessage = (event) => { this.onMessage(event); };
  }

  private registerErrorEvent()
  {
     return this.webSocket.onerror = (event) => { this.onError(event); };
  }

  private registerCloseEvent()
  {
     return this.webSocket.onclose = (event) => { this.onClose(event); };
  }

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

  private isClosingOrClosed()
  {
    const isClosing = this.webSocket.readyState === WebSocket.CLOSING;
    const isClosed = this.webSocket.readyState === WebSocket.CLOSED

    return isClosing || isClosed;
  }

  // ---------------- Event handlers --------------------

  protected onOpen(event: Types.OpenEvent)
  {
    this.wasConnected = true;
  }

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
      await this.deserializeAndProcessPacket(event.data);
    }
    catch (error)
    {
      Syslog.reportUncaughtException(error);
    }
  }

  private onError(event: Types.ErrorEvent)
  {
    // We don't close the connection here, because when 'error'
    // event is fired 'close' event is fired as well.

    let message = "Socket error occured";

    if (event.message)
      message += ": " + event.message;

    message += ". Connection to " + this.getOrigin() + " will close";

    Syslog.log("[WEBSOCKET]", message);
  }

  protected onClose(event: Types.CloseEvent)
  {
    this.cleanup();
  }
}