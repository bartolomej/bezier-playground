import { Bezier, Spline } from "../math/index.js";


export default class CubicSplineDrawer {

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

  onPointerDown(position) {
    this.addPoint(position);
  }

  onPointerUp(position) {
    this.addPoint(position);
  }

  onMouseMove(position) {
    // TODO: refactor logic and implement "preview" functionality
    // this.spline.setLastPoint(position);
  }

  addPoint (point) {
    if (this.spline.curves.length === 0) {
      this.spline.addCurve();
    }

    this.spline.addPoint(point);

    const l = this.spline.lastCurve.points.length;
    if (l !== 0 && l % 4 === 0) {
      console.log("adding additional curve")
      this.spline.addCurve();
    }

  }

  render (ctx) {
    const { spline, width } = this;
    const diff = 0.01;
    ctx.beginPath();
    ctx.lineWidth = width;

    // draw bezier curve
    for (let i = 0; i < spline.size(); i += diff) {
      const v = spline.value(i);
      if (i > 0) {
        ctx.lineTo(v.x, v.y);
      } else {
        ctx.moveTo(v.x, v.y);
      }
    }

    // draw bezier points
    for (let i = 0; i < spline.curves.length; i++) {
      const curve = spline.curves[i];
      for (let j = 0; j < curve.points.length; j++) {
        const p = curve.points[j];
        if (j === 1 || j === 3) {
          const p0 = curve.points[j - 1];
          ctx.moveTo(p0.x, p0.y);
          ctx.lineTo(p.x, p.y);
        }
        const r = width * 2;
        ctx.moveTo(p.x + r, p.y);
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
      }
    }

    ctx.stroke();
  }
}
