import Bernstein from "./bernstein.js";
import Vector from "./vector.js";


export default class Bezier {

  constructor (points = []) {
    this._functions = points.map((v, i) => new Bernstein(i, points.length - 1));
    this._points = points;
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
