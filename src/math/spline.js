export default class Spline {

  constructor (curves = []) {
    this._curves = curves;
  }

  size() {
    return this._curves.length;
  }

  value(t) {
    return this._curves[this._getCurveIndex(t)].value(t);
  }

  derivative(t) {
    return this._curves[this._getCurveIndex(t)].value(t);
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
