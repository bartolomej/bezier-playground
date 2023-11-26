// Return matrices as 2D arrays in row-major order, e.g.:
// return [
//     [ 1, 2, 3, 4 ],
//     [ 5, 6, 7, 8 ],
//     [ 7, 6, 5, 4 ],
//     [ 3, 2, 1, 0 ],
// ];

import {dot} from "./vector.js";

/**
 * Takes in transformation matrices of the same dimensions and multiples them.
 * @param matrices {Array[]}
 */
export function composeTransformations(matrices) {
    return matrices.reduce((composed, m) => multiply(composed, m), identity(getDimensions(matrices[0])))
}

export function identity({cols, rows} = {rows: 4, cols: 4}) {
    const m = [];
    for (let r = 0; r < rows; r++) {
        m.push(Array.from({length: cols}).map((_, i) => i === r ? 1 : 0))
    }
    return m;
}


export function translation(t) {
    const r = identity({
        rows: t.length + 1,
        cols: t.length + 1
    });

    for (let i = 0; i < t.length; i++) {
        r[i][t.length] = t[i];
    }

    return r;
}

export function scaling(s) {
    const r = identity({rows: s.length, cols: s.length});
    for (let i = 0; i < s.length; i++) {
        r[i][i] = s[i];
    }
    return r;
}

export function rotationX(angle) {
    const cosA = Math.cos(angle);
    const sinA = Math.sin(angle);
    return [
        [1, 0, 0, 0],
        [0, cosA, -sinA, 0],
        [0, sinA, cosA, 0],
        [0, 0, 0, 1],
    ];
}

export function rotationY(angle) {
    const cosA = Math.cos(angle);
    const sinA = Math.sin(angle);
    return [
        [cosA, 0, sinA, 0],
        [0, 1, 0, 0],
        [-sinA, 0, cosA, 0],
        [0, 0, 0, 1],
    ];
}

export function rotationZ(angle) {
    const cosA = Math.cos(angle);
    const sinA = Math.sin(angle);
    return [
        [cosA, -sinA, 0, 0],
        [sinA, cosA, 0, 0],
        [0, 0, 1, 0],
        [0, 0, 0, 1],
    ];
}

export function negate(m) {
    return m.map(row => row.map(e => -e));
}

export function add(m, n) {
    const dimensions = getDimensions(m);
    const r = identity(dimensions);
    for (let row = 0; row < dimensions.rows; row++) {
        for (let col = 0; col < dimensions.cols; col++) {
            r[row][col] = m[row][col] + n[row][col];
        }
    }
    return r;
}

export function subtract(m, n) {
    return add(m, negate(n));
}

export function transpose(m) {
    const {rows, cols} = getDimensions(m)
    const tm = identity({
        cols: rows,
        rows: cols
    });

    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            tm[col][row] = m[row][col];
        }
    }

    return tm;
}

export function multiply(m, n) {
    const mDim = getDimensions(m);
    const nDim = getDimensions(n);
    if (mDim.cols !== nDim.rows) {
        throw new Error("Invalid input matrices. The number of columns of `m` must match the number of rows of `n`.")
    }
    const r = identity({
        cols: nDim.cols,
        rows: mDim.rows
    });
    for (let col = 0; col < nDim.cols; col++) {
        for (let row = 0; row < mDim.rows; row++) {
            r[row][col] = dot(
                getRow(m, row),
                getCol(n, col)
            )
        }
    }
    return r;
}

export function transform(m, v) {
    return multiply(m, v.map(e => [e])).flat();
}

// Helpers

function getDimensions(m) {
    return {
        rows: m.length,
        cols: m[0].length
    }
}

function getRow(m, row) {
    return m[row];
}

function getCol(m, col) {
    const column = [];
    for (let row = 0; row < m.length; row++) {
        column.push(m[row][col])
    }
    return column;
}
