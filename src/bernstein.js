import {Utils} from "./utils.js";

export default class Bernstein {
  #function;
  #derivative;

  /**
   * Create a Bernstein polynomial of degree n.
   */
  constructor (n, k) {
    if (k > n) {
      throw new Error("v must not be greater than n")
    }
    this.#function = this.#build(k, n);
    this.#derivative = this.#buildDerivative(k, n);
  }

  value (x) {
    return this.#function(x);
  }

  derivative (x) {
    return this.#derivative(x);
  }

  #buildDerivative(k, n) {
    return x => n * (this.#build(k - 1, n - 1)(x) - this.#build(k, n - 1)(x));
  }

  #build (k, n) {
    return x => Utils.binomial(n, k) * x ** k * (1 - x) ** (n - k);
  }

}
