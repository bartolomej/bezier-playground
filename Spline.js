import Bezier from "./Bezier.js";


export default class Spline {

  constructor (curves = []) {
    this.curves = curves;
  }

  get lastCurveIndex () {
    return this.curves.length - 1;
  }

  get lastCurve () {
    return this.curves[this.lastCurveIndex];
  }

  get totalPoints () {
    return this.curves.map(c => c.length).reduce((p, c) => p = c, 0);
  }

  addCurve () {
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

  addPoint (point) {
    const lastCurveIndex = this.curves.length - 1;
    this.curves[lastCurveIndex].addPoint(point)
  }

  setPoint (curveIndex, pointIndex, point) {
    const curve = this.curves[curveIndex];
    if (curve && curve.points.length > 0) {
      curve.points[pointIndex] = point;
    }
  }

  removeCurve(curveIndex) {
    this.curves.splice(curveIndex, 1)
  }

  getPoint(curveIndex, pointIndex) {
    return this.curves[curveIndex].points[pointIndex];
  }

  size () {
    return this.curves.length;
  }

  value (t) {
    const curveIndex = this._getCurveIndex(t);
    return this.curves[curveIndex].value(t - curveIndex);
  }

  derivative (t) {
    return this.curves[this._getCurveIndex(t)].derivative(t);
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
