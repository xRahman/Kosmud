
import {Body} from '../../Client/Gui/Body';

export class Canvas
{
  private width = Body.getCanvasDivElement().clientWidth;
  private height = Body.getCanvasDivElement().clientHeight;

  public getWidth() { return this.width; }
  public getHeight() { return this.height; }

  public updateSize()
  {
    this.width = Body.getCanvasDivElement().clientWidth;
    this.height = Body.getCanvasDivElement().clientHeight;
  }
}
