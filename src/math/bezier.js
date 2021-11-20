import Bernstein from "./bernstein.js";
import Vector from "./vector.js";


export default class Bezier {

  constructor (points = []) {
    this.points = points;
    this._buildFunctions();
  }

  get lastPointIndex() {
    return this.points.length - 1;
  }

  get lastPoint() {
    return this.points[this.lastPointIndex];
  }

  addPoint (point) {
    this.points.push(point);
    this._buildFunctions();
  }

  _buildFunctions () {
    this._functions = this.points.map((v, i) =>
      new Bernstein(i, this.points.length - 1)
    );
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
}
