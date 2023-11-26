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
    if (n === 0) {
      // The derivative of a constant (b_{0,0}) is 0
      return x => 0;
    }

    // Handle edge cases where the Bernstein polynomial is 0
    const b1 = (k - 1 < 0) ? () => 0 : this.#build(k - 1, n - 1);
    const b2 = (k > n - 1) ? () => 0 : this.#build(k, n - 1);

    return x => n * (b1(x) - b2(x));
  }

  #build (k, n) {
    const binom = Utils.binomial(n, k);
    return x => binom * x ** k * (1 - x) ** (n - k);
  }

}
