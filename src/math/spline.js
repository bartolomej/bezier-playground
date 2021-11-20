export default class Spline {

  constructor (curves = []) {
    this.curves = curves;
  }

  addPointToEnd(point) {
    this.curves[this.curves.length - 1].addPoint(point)
  }

  size() {
    return this.curves.length;
  }

  value(t) {
    return this.curves[this._getCurveIndex(t)].value(t);
  }

  derivative(t) {
    return this.curves[this._getCurveIndex(t)].value(t);
  }

  makeContinuous() {
    // TODO: implement
  }

  makeSmooth() {
    // TODO: implement
  }

  _getCurveIndex(t) {
    return Math.floor(t);
  }
}
