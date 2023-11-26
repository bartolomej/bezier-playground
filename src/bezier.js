import Bernstein from "./bernstein.js";
import {add, initZeroVector, multiplyScalar} from "./vector.js";


export default class Bezier {

  /**
   * Create a Bézier curve given a list of points.
   * @param points {Array[]}
   */
  constructor (points = []) {
    this.points = points;
    this.#buildFunctions();
  }

  get lastPointIndex() {
    return this.points.length - 1;
  }

  get length() {
    return this.points.length;
  }

  get dimension() {
    // Assuming all point vectors have the same dimension.
    return this.points[0].length;
  }

  addPoint (point) {
    this.points.push(point);
    this.#buildFunctions();
  }

  /**
   * Point position at t=[0,1]
   */
  value (t) {
    return this.points
      .map((v, i) => multiplyScalar(v, this._functions[i].value(t)))
      .reduce((p, c) => add(p, c), initZeroVector(this.dimension));
  }

  /**
   * Point derivative at t=[0,1].
   */
  derivative (t) {
    return this.points
      .map((v, i) => multiplyScalar(v, this._functions[i].derivative(t)))
      .reduce((p, c) => add(p, c), initZeroVector(this.dimension));
  }

  #buildFunctions () {
    this._functions = this.points.map((v, i) =>
        new Bernstein(this.points.length - 1, i)
    );
  }
}
