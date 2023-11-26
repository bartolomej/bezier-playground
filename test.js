import { Bernstein, Bezier, Spline } from "./index.js";
import { Utils } from "./utils.js"



// use bellow tool for playing around with transformations
// https://tinylittlemaggie.github.io/transformation-matrix-playground/

describe('Utils class tests', function () {
  it('should calculate factorial of n', function () {
    expect(Utils.factorial(1)).toBe(1);
    expect(Utils.factorial(5)).toBe(120);
  });

  it('should calculate binomial coefficient', function () {
    expect(Utils.binomial(5, 5)).toBe(1);
    expect(Utils.binomial(5, 1)).toBe(5);
    expect(Utils.binomial(5, 3)).toBe(10);
  });
})

describe('Bernstein class tests', function () {

  it('should build and calculate polynomial function', function () {
    // test example taken from https://en.wikipedia.org/wiki/Bernstein_polynomial#Definition
    const b = new Bernstein(5, 2);
    expect(b.value(0)).toBe(0);
    expect(b.value(1)).toBe(0);
    expect(b.value(2)).toBe(-40);
  });

  it('should calculate polynomial derivative', function () {
    const b = new Bernstein(3, 2);
    expect(b.value(0)).toBe(0);
    expect(b.derivative(1)).toBe(-3);
  });

})

// use bellow link as a helper tool for testing bezier
// https://www.desmos.com/calculator/d1ofwre0fr

describe('Bezier class tests', function () {

  it('should compute a bezier curve', function () {
    const c = new Bezier([
      [0, 0],
      [0, 1],
      [1, 1],
      [1, 0],
    ]);

    expect(c.value(0)).toEqual([0, 0])
    expect(c.value(1)).toEqual([1, 0])
  });

})

describe('Spline class tests', function () {

  it('should calculate value of spline curve', function () {
    const s = new Spline([
      new Bezier([
        [0, 0, 0, 0],
        [0, 1, 0, 0],
        [0, 2, 0, 0],
        [1, 2, 0, 0],
      ]),
      new Bezier([
        [1, 2, 0, 0],
        [2, 2, 0, 0],
        [2, 1, 0, 0],
        [2, 0, 0, 0],
      ])
    ])

    expect(s.value(0)).toEqual([0, 0, 0, 0])
    expect(s.value(1)).toEqual([1, 2, 0, 0])
    expect(s.value(2)).toEqual([2, 0, 0, 0])
  });
})
