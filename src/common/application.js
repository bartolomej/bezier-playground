import { Transformation2D } from "../math/index.js";


export class Application {

  constructor (canvas, options) {
    this._update = this._update.bind(this);

    this.canvas = canvas;
    this._init2d(options);
    this.start();

    requestAnimationFrame(this._update);
  }

  _init2d (options) {
    this.ctx = null;
    try {
      this.ctx = this.canvas.getContext('2d', options);
    } catch (error) {
    }

    if (!this.ctx) {
      console.log('Cannot create 2d context');
    }
  }

  _update () {
    this._resize();
    this.update();
    this.render();
    requestAnimationFrame(this._update);
  }

  _resize () {
    const canvas = this.canvas;

    if (canvas.width !== canvas.clientWidth ||
      canvas.height !== canvas.clientHeight) {
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;

      this.resize();
    }
  }

  start () {
    // initialization code (including event handler binding)
  }

  update () {
    // update code (input, animations, AI ...)
  }

  render () {
    const { ctx, canvas } = this;

    // reset applied transformations
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);

    // clear existing drawing on canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // apply transformations again (move origin to center + vertical flip)
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.scale(1, -1);

    // begin drawing path
    ctx.beginPath();

    // render code (2d context API calls)
  }

  transform (v) {
    const { canvas } = this;
    const scale = new Transformation2D();
    scale.scaleY = -1;
    const translate = new Transformation2D();
    translate.translateX = - canvas.width / 2;
    translate.translateY = - canvas.height / 2;
    return scale.transform(translate.transform(v));
  }

  resize () {
    // resize code (e.g. update projection matrix)
  }

}
