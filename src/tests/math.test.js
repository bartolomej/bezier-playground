import { Vector, Bernstein, Bezier, Spline } from "../math";


describe('Vector class tests', function () {

  it('should init vector in two different ways', function () {
    const v1 = new Vector(1,2,3);
    const v2 = new Vector([1,2,3]);
    expect(v1.toArray()).toEqual(v2.toArray());
  });

  it('should add/subtract two vectors', function () {
    const v1 = new Vector([1, 2, 3]);
    const v2 = new Vector([3, 2, 1]);
    expect(v1.add(v2).toArray()).toEqual([4, 4, 4])
  });

  it('should multiply vector with scalar', function () {
    const v = new Vector([1, 2, 3]);
    const s = 2;
    expect(v.mulScalar(s).toArray()).toEqual([2, 4, 6])
  });

});

describe('Bernstein class tests', function () {

  it('should calculate factorial of n', function () {
    expect(Bernstein.factorial(1)).toBe(1);
    expect(Bernstein.factorial(5)).toBe(120);
  });

  it('should calculate binomial coefficient', function () {
    expect(Bernstein.binomial(5, 5)).toBe(1);
    expect(Bernstein.binomial(5, 1)).toBe(5);
    expect(Bernstein.binomial(5, 3)).toBe(10);
  });

  it('should build and calculate polynomial function', function () {
    // test example taken from https://en.wikipedia.org/wiki/Bernstein_polynomial#Definition
    const b = new Bernstein(2, 5);
    expect(b.value(0)).toBe(0);
    expect(b.value(1)).toBe(0);
    expect(b.value(2)).toBe(-40);
  });

  it('should calculate polynomial derivative', function () {
    const b = new Bernstein(2, 3);
    expect(b.value(0)).toBe(0);
    expect(b.derivative(1)).toBe(-3);
  });

})

// use bellow link as a helper tool for testing bezier
// https://www.desmos.com/calculator/d1ofwre0fr

describe('Bezier class tests', function () {

  it('should compute a bezier curve', function () {
    const c = new Bezier([
      new Vector([0, 0]),
      new Vector([0, 1]),
      new Vector([1, 1]),
      new Vector([1, 0]),
    ]);

    expect(c.value(0).toArray()).toEqual([0, 0])
    expect(c.value(1).toArray()).toEqual([1, 0])
  });

})

describe('Spline class tests', function () {

  it('should calculate value of spline curve', function () {
    const s = new Spline([
      new Bezier([
        new Vector([0,0]),
        new Vector([0,1]),
        new Vector([1,1]),
        new Vector([1,2]),
      ]),
      new Bezier([
        new Vector([1,2]),
        new Vector([1,3]),
        new Vector([0,3]),
        new Vector([0,4]),
      ])
    ])

    expect(s.value(1).toArray()).toEqual([1,2])
    expect(s.value(2).toArray()).toEqual([0,4]) // TODO: investigate and fix
  });
})
