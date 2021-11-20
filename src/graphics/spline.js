import { Spline } from "../math/index.js";


export default class SplineDrawer {

  constructor (spline) {
    this.spline = spline || new Spline()
    this.width = 5;
  }

  /**
   * DRAWING PROCEDURE:
   * - first pointerdown defines P1
   * - first pointerup defines C1
   * - second pointerdown defines P2
   * - second pointerup defines C1
   */

  onMouseEvent (type, position) {
    console.log(type, position.x, position.y)
    // TODO: handle event type
  }

  render (ctx) {
    const { spline, width } = this;
    const diff = 0.01;
    ctx.beginPath();
    ctx.lineWidth = width;
    for (let i = 0; i < spline.size(); i += diff) {
      const v = spline.value(i);
      if (i > 0) {
        ctx.lineTo(v.x, v.y);
      } else {
        ctx.moveTo(v.x, v.y);
      }
    }
    ctx.stroke();
  }
}
