import { Spline } from "./index.js";
import {length, subtract} from "./vector.js";


export default class CubicSplineDrawer {

  constructor (spline) {
    this.spline = spline || new Spline()
    this.width = 5;
    this.pointRadius = 5;
    this.color = '#000000';
    this.focusedColor = '#457B9D';
    this.controlColor = '#5e5e5e';
    this.isFocused = false; // is whole spline focused (selected)
    this.focusedCurveIndex = null;
    this.focusedPointIndex = null;
    this.diff = 0.01;
  }

  addPosition(position) {
    // TODO: iterate over all points and change their position
    // e.g.: point.add(position)
  }

  changeWidth (value) {
    this.width = value;
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
      const diff = length(subtract(spline.value(t), position))
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
        const isIntersection = length(subtract(position, curve.points[pi])) <= this.width;
        if (isIntersection) {
          return {ci, pi}
        }
      }
    }
    return null;
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
      const negVector = subtract(point, prevPoint)
      this.spline.setPoint(ci - 1, 2, subtract(prevPoint, negVector));
    }

    // is last control point in curve
    if (pi === 2 && ci < this.spline.lastCurveIndex) {
      // neighbour control point is the first point in the next curve
      const nextPoint = this.spline.getPoint(ci, pi + 1);
      const negVector = subtract(point, nextPoint)
      this.spline.setPoint(ci + 1, 1, subtract(nextPoint, negVector));
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
    ctx.strokeStyle = color;

    // draw bezier curve
    for (let t = 0; t < spline.size(); t += diff) {
      const v = spline.value(t);
      if (t > 0) {
        ctx.lineTo(v[0], v[1]);
      } else {
        ctx.moveTo(v[0], v[1]);
      }
    }

    ctx.stroke();
    ctx.lineWidth = isFocused ? 2 : 1;
    ctx.strokeStyle = isFocused ? focusedColor : controlColor

    // draw bezier points
    for (let i = 0; i < spline.curves.length; i++) {
      const curve = spline.curves[i];
      for (let j = 0; j < curve.points.length; j++) {
        const p = curve.points[j];
        if (j === 1 || j === 3) {
          const p0 = curve.points[j - 1];
          ctx.moveTo(p0[0], p0[1]);
          ctx.lineTo(p[0], p[1]);
          ctx.arc(p[0], p[1], r, 0, Math.PI * 2);
        } else {
          ctx.moveTo(p[0] + r, p[1]);
          ctx.arc(p[0], p[1], r, 0, Math.PI * 2);
        }
      }
    }

    ctx.stroke();
  }

}
