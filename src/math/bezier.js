import Bernstein from "./bernstein.js";
import Vector from "./vector.js";


export default class Bezier {

  constructor (points = []) {
    this._points = points;
    this._buildFunctions();
  }

  get totalPoints() {
    return this._points.length;
  }

  addPoint (point) {
    this._points.push(point);
    this._buildFunctions();
  }

  _buildFunctions () {
    this._functions = this._points.map((v, i) =>
      new Bernstein(i, this._points.length - 1)
    );
  }

  value (t) {
    return this._points
      .map((v, i) => v.mulScalar(this._functions[i].value(t)))
      .reduce((p, c) => p.add(c), new Vector([0, 0]));
  }

  derivative (t) {
    return this._points
      .map((v, i) => v.mulScalar(this._functions[i].derivative(t)))
      .reduce((p, c) => p.add(c), new Vector([0, 0]));
  }
}
