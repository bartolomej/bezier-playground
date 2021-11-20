import { Application } from "./common/application.js";
import { Bezier, Spline, Vector } from "./math/index.js";

class App extends Application {
  start () {
    this.spline = new Spline([
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
    ])
  }

  update () {

  }

  render () {
    super.render();
    this.drawSpline(this.spline);
  }

  drawSpline(spline) {
    const {ctx} = this;
    ctx.moveTo(0,0);
    ctx.beginPath();
    for (let i = 0; i < spline.size(); i += 0.01) {
      const v = spline.value(i);
      ctx.lineTo(v.x, v.y);
    }
    ctx.stroke();
  }
}


document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.querySelector('canvas');
  window.app = new App(canvas);
})
