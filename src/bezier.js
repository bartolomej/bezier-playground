import Bernstein from "./bernstein.js";
import Vector from "./vector.js";


export default class Bezier {

  /**
   * Create a Bézier curve given a list of points.
   */
  constructor (points = []) {
    this.points = points;
    this._buildFunctions();
  }

  get lastPointIndex() {
    return this.points.length - 1;
  }

  get length() {
    return this.points.length;
  }

  addPoint (point) {
    this.points.push(point);
    this._buildFunctions();
  }

  value (t) {
    return this.points
      .map((v, i) => v.mulScalar(this._functions[i].value(t)))
      .reduce((p, c) => p.add(c), new Vector([0, 0]));
  }

  derivative (t) {
    return this.points
      .map((v, i) => v.mulScalar(this._functions[i].derivative(t)))
      .reduce((p, c) => p.add(c), new Vector([0, 0]));
  }

  _buildFunctions () {
    this._functions = this.points.map((v, i) =>
        new Bernstein(this.points.length - 1, i)
    );
  }
}
