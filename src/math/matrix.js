import Vector from "./vector.js";


export default class Matrix {
  constructor (cols, ...rest) {
    this.setMatrix(cols, ...rest);
  }

  setComponent(col, row, value) {
    this._cols[col].setComponent(row, value);
  }

  getComponent(col, row) {
    return this._cols[col].getComponent(row);
  }

  setMatrix(cols, ...rest) {
    // matrix columns can be given in an array form: [v1,v2,v3,..]
    // or in argument list form: v1,v2,v3,..
    if (cols instanceof Array) {
      this._cols = this._serialiseCols(cols);
    } else {
      this._cols = this._serialiseCols([cols, ...rest])
    }
  }

  _serialiseCols(cols) {
     if (cols[0] instanceof Vector) {
       return cols;
     } else {
       return cols.map(col => new Vector(col));
     }
  }

  subMatrix(col, row) {
    return new Matrix(
      this._cols
        .slice(0, col)
        .map(v => v.toArray().slice(0, row))
    )
  }

  get rows() {
    return this._cols[0].length();
  }

  get cols() {
    return this._cols.length;
  }

  row(i) {
    return new Vector(this._cols.map(v => v.toArray()[i]));
  }

  col(i) {
    return this._cols[i];
  }

  multiplyVector(v) {
    if (this.cols !== v.length()) {
      throw new Error("Invalid vector size")
    }
    let result = [];
    for (let ri = 0; ri < this.rows; ri++) {
      const row = this.row(ri);
      result.push(v.dotProduct(row));
    }
    return new Vector(result);
  }

  toArray() {
    return this._cols.map(v => v.toArray());
  }
}
