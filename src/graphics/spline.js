import { Spline } from "../math/index.js";


export default class CubicSplineDrawer {

  constructor (spline) {
    this.spline = spline || new Spline()
    this.width = 5;
    this.pointRadius = 5;
    this.color = '#000000';
    this.focusedCurveIndex = null;
    this.focusedPointIndex = null;
  }

  intersects (position) {
    const { spline } = this;
    // check if position intersects with any of the spline points
    for (let i = 0; i < spline.curves.length; i++) {
      const curve = spline.curves[i];
      for (let j = 0; j < curve.points.length; j++) {
        const point = curve.points[j];
        if (this.intersectsPoint(position, point)) {
          this.focusedCurveIndex = i;
          this.focusedPointIndex = j;
          return true;
        }
      }
    }
    return false;
  }

  intersectsPoint (targetV, pointV) {
    const diff = targetV.sub(pointV);
    return diff.abs() <= this.width;
  }

  setFocusedPoint (position) {
    const { focusedCurveIndex: ci, focusedPointIndex: pi } = this;
    // if there is a focused point, update it's position
    if (ci !== null && pi !== null) {
      this.setPoint(ci, pi, position)
    }
  }

  removeUnfinishedCurve() {
    if (this.focusedPointIndex !== null && this.focusedCurveIndex !== null) {
      // remove unfinished curve from spline
      this.spline.removeCurve(this.focusedCurveIndex);
      this.removeFocusedPoint();
    }
  }

  removeFocusedPoint () {
    this.focusedPointIndex = null;
    this.focusedCurveIndex = null;
  }

  setPoint (ci, pi, position) {
    // set C(n-1) control point to the negative vector of C(n)
    const isControlPoint = (pi + 1) % 2 === 0;
    if (isControlPoint) {
      const controlPoint = this.spline.getPoint(ci, pi);

      // first control point in curve
      if (pi === 1 && ci > 0) {
        const prevPoint = this.spline.getPoint(ci - 1, 3);
        const negVector = controlPoint.sub(prevPoint);
        this.spline.setPoint(ci - 1, 2, prevPoint.sub(negVector));
      }
      // last control point in curve
      if (pi === 3 && ci < this.spline.lastCurveIndex) {
        // TODO: implement when existing control point editing is supported
      }
    }
    this.spline.setPoint(ci, pi, position)
  }

  addPoint (point) {
    if (this.spline.curves.length === 0) {
      this.spline.addCurve();
    }

    if (this.spline.totalPoints === 0) {
      this.spline.addPoint(point);
    }

    this.spline.addPoint(point);

    const l = this.spline.lastCurve.points.length;
    if (l !== 0 && l % 4 === 0) {
      this.spline.addCurve();
    }

    this.focusedCurveIndex = this.spline.lastCurveIndex;
    this.focusedPointIndex = this.spline.lastCurve.lastPointIndex;
  }

  render (ctx) {
    const { spline, width, pointRadius: r } = this;
    const diff = 0.01;
    ctx.beginPath();
    ctx.lineWidth = width;
    ctx.strokeStyle = this.color;

    // draw bezier curve
    for (let i = 0; i < spline.size(); i += diff) {
      const v = spline.value(i);
      if (i > 0) {
        ctx.lineTo(v.x, v.y);
      } else {
        ctx.moveTo(v.x, v.y);
      }
    }

    ctx.stroke();
    ctx.lineWidth = 1;
    ctx.strokeStyle = '#5e5e5e';

    // draw bezier points
    for (let i = 0; i < spline.curves.length; i++) {
      const curve = spline.curves[i];
      for (let j = 0; j < curve.points.length; j++) {
        const p = curve.points[j];
        if (j === 1 || j === 3) {
          const p0 = curve.points[j - 1];
          ctx.moveTo(p0.x, p0.y);
          ctx.lineTo(p.x, p.y);
          ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
        } else {
          ctx.moveTo(p.x + r, p.y);
          ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
        }
      }
    }

    ctx.stroke();
  }

}
