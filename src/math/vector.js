export default class Vector {
  constructor (coords = []) {
    this._coords = coords;
  }

  length() {
    return this._coords.length;
  }

  neg() {
    return new Vector(this._coords.map(p => -p));
  }

  add(v) {
    return Vector.map(this, v, (p1, p2) => p1 + p2);
  }

  sub(v) {
    return Vector.map(this, v, (p1, p2) => p1 - p2);
  }

  mul(v) {
    return Vector.map(this, v, (p1, p2) => p1 * p2);
  }

  div(v) {
    return Vector.map(this, v, (p1, p2) => p1 / p2);
  }

  mulScalar(s) {
    return new Vector(this._coords.map(p => p * s))
  }

  divScalar(s) {
    return new Vector(this._coords.map(p => p / s))
  }

  toArray() {
    return this._coords;
  }

  static map(v1, v2, cb) {
    if (v1.length() !== v2.length()) {
      throw new Error("Vectors must have equal length");
    }
    const coords1 = v1.toArray();
    const coords2 = v2.toArray();
    return new Vector(coords1.map((p1, i) => cb(p1, coords2[i])))
  }
}
