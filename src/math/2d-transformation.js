import Matrix from "./matrix.js";
import Vector from "./vector.js";


/**
 * transformation matrix is defined as:
 *
 *  a c e
 *  b d f
 *  0 0 1
 *
 *  a - horizontal scaling
 *  d - vertical scaling
 *
 *  e - horizontal translation
 *  f - vertical translation
 *
 *  b - vertical shear
 *  c - horizontal shear
 *
 *
 *  useful tool for visualizing transformations:
 *  https://tinylittlemaggie.github.io/transformation-matrix-playground/
 */
export default class Transformation2D extends Matrix {

  constructor (t) {
    // default identity transformation
    super(t);
    if (!t) {
      this.setMatrix(this.identity);
    }
  }

  get identity() {
    return [
      [1, 0, 0],
      [0, 1, 0],
      [0, 0, 1]
    ]
  }

  set scale (value) {
    this.scaleX = value;
    this.scaleY = value;
  }

  set scaleX (value) {
    this.setComponent(0, 0, value)
  }

  get scaleX () {
    return this.setComponent(0, 0)
  }

  set scaleY (value) {
    this.setComponent(1, 1, value)
  }

  get scaleY () {
    return this.setComponent(1, 1)
  }

  set translateX (value) {
    this.setComponent(2, 0, value);
  }

  get translateX () {
    return this.getComponent(2, 0);
  }

  set translateY (value) {
    this.setComponent(2, 1, value);
  }

  get translateY () {
    return this.getComponent(2, 1);
  }

  transform (v) {
    const transformation = this.subMatrix(2, 2); // TODO: test
    const translation = new Vector(
      this.translateX,
      this.translateY
    );
    return transformation
      .multiplyVector(v) // transform
      .add(translation) // translate
  }
}
