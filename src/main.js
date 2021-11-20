import { Application } from "./common/application.js";
import { Bezier, Spline, Vector } from "./math/index.js";
import SplineDrawer from "./graphics/spline.js";

class App extends Application {
  start () {
    this.registerEvents();
    this.spline = new SplineDrawer(new Spline([
      new Bezier([
        new Vector([0,0]),
        new Vector([0,1]),
        new Vector([1,1]),
        new Vector([1,2]),
      ].map(v => v.mulScalar(100))),
      new Bezier([
        new Vector([1,2]),
        new Vector([1,3]),
        new Vector([0,3]),
        new Vector([0,4]),
      ].map(v => v.mulScalar(100)))
    ]))
  }

  registerEvents () {
    const { canvas } = this;
    canvas.addEventListener('click', this.onMouseEvent.bind(this))
    canvas.addEventListener('pointerdown', this.onMouseEvent.bind(this))
    canvas.addEventListener('pointerup', this.onMouseEvent.bind(this))
  }

  onMouseEvent(event) {
    const position = new Vector(event.clientX, event.clientY);
    this.spline.onMouseEvent(event.type, this.transform(position));
  }

  update () {

  }

  render () {
    const {ctx} = this;
    super.render();
    this.spline.render(ctx);
  }
}


document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.querySelector('canvas');
  window.app = new App(canvas);
})
