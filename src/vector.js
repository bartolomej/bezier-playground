// Return vectors as arrays, e.g.:
// return [ 1, 2, 3, 4 ];

export function initZeroVector(dimension) {
    return Array.from({ length: dimension}).map(() => 0)
}

export function negate(v) {
    return v.map(e => -e);
}

export function add(v, w) {
    return v.map((e, i) => e + w[i]);
}

export function subtract(v, w) {
    return add(v, negate(w));
}

export function multiply(v, w) {
    return v.map((e, i) => e * w[i]);
}

export function divide(v, w) {
    return multiply(v, inverse(w))
}

export function dot(v, w) {
    return multiply(v, w).reduce((sum, e) => sum + e, 0);
}

export function cross(v, w) {
    if (v.length !== 3 || w.length !== 3) {
        throw new Error("Cross product is only defined for 3d vectors")
    }
    return [
        v[1] * w[2] - v[2] * w[1],
        v[2] * w[0] - v[0] * w[2],
        v[0] * w[1] - v[1] * w[0],
    ]
}

export function length(v) {
    return Math.sqrt(v.map(e => e ** 2).reduce((sum, e) => sum + e, 0))
}

export function normalize(v) {
    return multiply(v, inverse(v));
}

export function project(v, w) {
    return multiplyScalar(w, dot(v, w) / length(w) ** 2);
}

export function reflect(d, n) {
    return subtract(d, multiplyScalar(n, (dot(d, n) * 2) / length(n) ** 2))
}

export function angle(v, w) {
    // The result of the inner expression may have numerical errors,
    // so it can cause acos to return NaN if the value is outside its defined domain.
    // To avoid that, let's clamp the value to the min/max domain range.
    return Math.acos(clamp(dot(v, w) / (length(v) * length(w)), -1, 1))
}

export function multiplyScalar(v, k) {
    return v.map(v => v * k)
}

function inverse(v) {
    return v.map((e) => 1 / e);
}

function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max)
}
