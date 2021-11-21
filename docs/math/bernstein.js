export default class Bernstein {

  constructor (v, n) {
    if (v > n) {
      throw new Error("v must not be greater than n")
    }
    this._f = Bernstein.build(v, n);
    this._d = Bernstein.buildDerivative(v, n);
  }

  value (x) {
    return this._f(x);
  }

  derivative (x) {
    return this._d(x);
  }

  static buildDerivative(v, n) {
    return x => n * (Bernstein.build(v - 1, n - 1)(x) - Bernstein.build(v, n - 1)(x));
  }

  static build (v, n) {
    return x => Bernstein.binomial(n, v) * x ** v * (1 - x) ** (n - v);
  }

  static factorial (n) {
    if (n === 0) return 1;
    return n * this.factorial(n - 1);
  }

  static binomial (n, k) {
    return this.factorial(n) / (this.factorial(k) * this.factorial(n - k))
  }
}
