import { Application } from "./common/application.js";
import { Spline, Vector } from "./math/index.js";
import CubicSplineDrawer from "./graphics/spline.js";


const AppState = {
  DRAW: 'draw',
  EDIT: 'edit'
}

class App extends Application {
  start () {
    this.penButton = document.querySelector('#pen');
    this.moveButton = document.querySelector('#move');
    this.colorInput = document.querySelector('#color');
    this.deleteButton = document.querySelector('#delete');
    this.state = null; // "edit" or "draw"
    this.focusedSplineIndex = null;
    this.splines = []
    this.prevMousePosition = null;
    this.currMousePosition = null;

    this.setState(AppState.DRAW);
    this.registerEvents();
  }

  get focusedSpline () {
    if (this.focusedSplineIndex === null) {
      return null;
    } else {
      return this.splines[this.focusedSplineIndex];
    }
  }

  registerEvents () {
    const { canvas, moveButton, penButton, deleteButton, colorInput } = this;
    const add = canvas.addEventListener;

    add('pointerdown', this.onPointerDown.bind(this));
    add('pointerup', this.onPointerUp.bind(this));
    add('mousemove', this.onMouseMove.bind(this));

    document.addEventListener('keydown', this.onKeyDown.bind(this))

    penButton.addEventListener('click', this.onPenButtonClick.bind(this));
    moveButton.addEventListener('click', this.onMoveButtonClick.bind(this));
    deleteButton.addEventListener('click', this.onDeleteButtonClick.bind(this));
    colorInput.addEventListener('input', this.onChangeColorInput.bind(this));
  }

  onDeleteButtonClick () {
    if (this.focusedSpline !== null) {
      this.splines.splice(this.focusedSplineIndex, 1);
      this.focusedSplineIndex = null;
    }
  }

  onChangeColorInput (event) {
    if (this.focusedSpline !== null) {
      this.focusedSpline.changeColor(event.target.value);
    }
  }

  onPenButtonClick () {
    this.setState(AppState.DRAW);
  }

  onMoveButtonClick () {
    this.setState(AppState.EDIT);
  }

  setState (state) {
    const { penButton, moveButton } = this;
    this.state = state;
    this.focusedSplineIndex = null;
    if (state === AppState.EDIT) {
      penButton.style.backgroundColor = 'transparent';
      moveButton.style.backgroundColor = 'red';
    }
    if (state === AppState.DRAW) {
      moveButton.style.backgroundColor = 'transparent';
      penButton.style.backgroundColor = 'red';
    }
  }

  onPointerDown (event) {
    const position = this._getEventPosition(event);

    if (this.state === AppState.EDIT) {
      for (let i = 0; i < this.splines.length; i++) {
        if (
          this.splines[i].checkPointIntersections(position) ||
          this.splines[i].checkCurveIntersection(position)
        ) {
          this.focusedSplineIndex = i;
          break;
        }
      }
    }

    if (this.state === AppState.DRAW) {
      if (this.focusedSpline === null) {
        this.splines.push(new CubicSplineDrawer(new Spline()))
        this.focusedSplineIndex = this.splines.length - 1;
      }
      this.focusedSpline.addPoint(position);
    }
  }

  onPointerUp (event) {
    if (this.focusedSpline === null) {
      return;
    }
    if (this.state === AppState.DRAW) {
      this.focusedSpline.addPoint(this._getEventPosition(event))
    } else {
      this.focusedSpline.removeFocusedPoint();
    }
  }

  onMouseMove (event) {
    const {prevMousePosition, currMousePosition} = this;
    const position = this._getEventPosition(event);

    if (this.focusedSpline === null) {
      return;
    }
    if (this.state === AppState.DRAW) {
      this.focusedSpline.setFocusedPoint(position)
    } else {
      this.prevMousePosition = currMousePosition;
      this.currMousePosition = position;

      const intersection = this.focusedSpline.getCurveIntersection(position);
      if (intersection !== null && prevMousePosition !== null) {
        const positionChange = currMousePosition.sub(prevMousePosition);
        this.focusedSpline.addPosition(positionChange);
      }
    }
  }

  onKeyDown (event) {
    if (
      this.state === AppState.DRAW &&
      event.key === 'Escape' &&
      this.focusedSpline !== null
    ) {
      this.focusedSpline.removeUnfinishedCurve();
      this.focusedSplineIndex = null;
    }
  }

  render () {
    const { ctx, splines } = this;
    super.render();
    for (const spline of splines) {
      spline.render(ctx);
    }
  }

  _getEventPosition (event) {
    return this.transform(new Vector(event.clientX, event.clientY));
  }
}

document.addEventListener('DOMContentLoaded', () => {
  // stop event propagation for navbar clicks
  const navbar = document.querySelector('#navbar');
  navbar.addEventListener('pointerdown', e => e.stopPropagation())
  navbar.addEventListener('pointerup', e => e.stopPropagation())

  const canvas = document.querySelector('canvas');
  window.app = new App(canvas);
})
