import { Application } from "./common/application.js";
import { Spline, Vector } from "./math/index.js";
import CubicSplineDrawer from "./graphics/spline.js";


class App extends Application {
  start () {
    this.registerEvents();
    this.focusedSplineIndex = null;
    this.splines = []
  }

  get focusedSpline() {
    if (this.focusedSplineIndex === null) {
      return null;
    } else {
      return this.splines[this.focusedSplineIndex];
    }
  }

  registerEvents () {
    const { canvas } = this;
    const add = canvas.addEventListener;
    add('pointerdown', this.onPointerDown.bind(this));
    add('pointerup', this.onPointerUp.bind(this));
    add('mousemove', this.onMouseMove.bind(this));
    document.addEventListener('keydown', this.onKeyDown.bind(this))
  }

  onPointerDown(event) {
    if (this.focusedSpline === null) {
      this.splines.push(new CubicSplineDrawer(new Spline()))
      this.focusedSplineIndex = this.splines.length - 1;
    }
    this.focusedSpline.onPointerDown(this._getEventPosition(event));
  }

  onPointerUp(event) {
    if (this.focusedSpline !== null) {
      this.focusedSpline.onPointerUp(this._getEventPosition(event))
    }
  }

  onMouseMove() {
    if (this.focusedSpline !== null) {
      this.focusedSpline.onMouseMove(this._getEventPosition(event))
    }
  }

  onKeyDown(event) {
    if (event.key === 'Escape' && this.focusedSpline !== null) {
      this.focusedSpline.removeFocusedPoint();
      this.focusedSplineIndex = null;
    }
  }

  update () {

  }

  render () {
    const { ctx, splines } = this;
    super.render();
    for (const spline of splines) {
      spline.render(ctx);
    }
  }

  _getEventPosition(event) {
    return this.transform(new Vector(event.clientX, event.clientY));
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.querySelector('canvas');
  window.app = new App(canvas);
})
