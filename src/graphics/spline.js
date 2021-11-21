import { Spline } from "../math/index.js";


export default class CubicSplineDrawer {

  constructor (spline) {
    this.spline = spline || new Spline()
    this.width = 5;
    this.pointRadius = 5;
    this.color = '#000000';
    this.focusedColor = '#d34343';
    this.controlColor = '#5e5e5e';
    this.isFocused = false; // is whole spline focused (selected)
    this.focusedCurveIndex = null;
    this.focusedPointIndex = null;
    this.diff = 0.01;
  }

  addPosition(position) {
    // TODO: iterate over all points and change their position
    // e.g.: point.add(position)
    // console.log("adding position: ", position.x, position.y)
  }

  changeColor (value) {
    this.color = value;
  }

  checkCurveIntersection (position) {
    const intersection = this.getCurveIntersection(position);
    const isIntersected = intersection !== null;
    this.isFocused = isIntersected;
    return isIntersected;
  }

  checkPointIntersections (position) {
    const intersection = this.getPointIntersection(position);
    console.log('checking point intersection: ', intersection)
    if (intersection !== null) {
      const {ci, pi} = intersection;
      this.focusedCurveIndex = ci;
      this.focusedPointIndex = pi;
      return true;
    } else {
      return false;
    }
  }

  getCurveIntersection(position) {
    const { spline, width, diff } = this;
    console.log('checking curve intersection')
    for (let t = 0; t < spline.size(); t += diff) {
      const v = spline.value(t);
      const diff = v.sub(position).abs();
      if (diff <= width) {
        return t;
      }
    }
    return null;
  }

  getPointIntersection(position) {
    const { spline } = this;
    // check if position intersects with any of the spline points
    for (let ci = 0; ci < spline.curves.length; ci++) {
      const curve = spline.curves[ci];
      for (let pi = 0; pi < curve.points.length; pi++) {
        const point = curve.points[pi];
        if (this.intersectsPoint(position, point)) {
          return {ci, pi}
        }
      }
    }
    return null;
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

  removeUnfinishedCurve () {
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
    // lock neighbour control points
    // set C(n-1) control point to the negative vector of C(n)
    const point = this.spline.getPoint(ci, pi);

    // is first control point in curve
    if (pi === 1 && ci > 0) {
      // neighbour point is the last point in previous curve
      const prevPoint = this.spline.getPoint(ci - 1, 3);
      const negVector = point.sub(prevPoint);
      this.spline.setPoint(ci - 1, 2, prevPoint.sub(negVector));
    }

    // is last control point in curve
    if (pi === 2 && ci < this.spline.lastCurveIndex) {
      // neighbour control point is the first point in the next curve
      const nextPoint = this.spline.getPoint(ci, pi + 1);
      const negVector = point.sub(nextPoint);
      this.spline.setPoint(ci + 1, 1, nextPoint.sub(negVector));
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
    const {
      spline,
      width,
      diff,
      controlColor,
      color,
      focusedColor,
      isFocused,
      pointRadius: r
    } = this;

    ctx.beginPath();
    ctx.lineWidth = width;
    ctx.strokeStyle = isFocused ? focusedColor : color;

    // draw bezier curve
    for (let t = 0; t < spline.size(); t += diff) {
      const v = spline.value(t);
      if (t > 0) {
        ctx.lineTo(v.x, v.y);
      } else {
        ctx.moveTo(v.x, v.y);
      }
    }

    ctx.stroke();
    ctx.lineWidth = 1;
    ctx.strokeStyle = controlColor;

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
