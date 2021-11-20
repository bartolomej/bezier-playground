import { Application } from "./common/application.js";
import { Bezier, Spline, Vector } from "./math/index.js";
import SplineDrawer from "./graphics/spline.js";


class App extends Application {
  start () {
    this.registerEvents();
    this.spline = new SplineDrawer(new Spline([
      new Bezier()
    ]))
  }

  registerEvents () {
    const { canvas } = this;
    const mouseEvents = ['click', 'pointerdown', 'pointerup'];
    mouseEvents.forEach(eventType => {
      canvas.addEventListener(eventType, this.onMouseEvent.bind(this))
    });
  }

  onMouseEvent (event) {
    const position = this.transform(new Vector(event.clientX, event.clientY));
    switch (event.type) {
      case 'pointerdown':
        return this.spline.onPointerDown(position);
      case 'pointerup':
        return this.spline.onPointerUp(position);
    }
  }

  update () {

  }

  render () {
    const { ctx } = this;
    super.render();
    this.spline.render(ctx);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.querySelector('canvas');
  window.app = new App(canvas);
})
