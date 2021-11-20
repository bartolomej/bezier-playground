import Bezier from "./bezier.js";


export default class Spline {

  constructor (curves = []) {
    this.curves = curves;
  }

  get lastCurveIndex() {
    return this.curves.length - 1;
  }

  get lastCurve() {
    return this.curves[this.lastCurveIndex];
  }

  addPoint (point) {
    const lastCurveIndex = this.curves.length - 1;
    this.curves[lastCurveIndex].addPoint(point)
  }

  addCurve() {
    if (this.curves.length === 0) {
      this.curves.push(new Bezier());
    } else {
      const prevCurve = this.lastCurve;
      // C1 and C2 of new curve are the same as C1 and C2 of previous curve
      this.curves.push(new Bezier(
        prevCurve.points.slice(2, 4)
      ))
    }
  }

  setLastPoint (point) {
    if (this.curves.length > 0) {
      const lastCurve = this.curves[this.curves.length - 1];
      if (lastCurve.points.length > 0) {
        lastCurve.points[lastCurve.points.length - 1] = point;
      }
    }
  }

  size () {
    return this.curves.length;
  }

  value (t) {
    const curveIndex = this._getCurveIndex(t);
    return this.curves[curveIndex].value(t - curveIndex);
  }

  derivative (t) {
    return this.curves[this._getCurveIndex(t)].value(t);
  }

  makeContinuous () {
    // TODO: implement
  }

  makeSmooth () {
    // TODO: implement
  }

  _getCurveIndex (t) {
    return Math.max(Math.ceil(t - 1), 0);
  }
}
