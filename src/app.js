import { Application } from "./application.js";
import { Spline } from "./index.js";
import Bezier2d from "./bezier-2d.js";
import {subtract} from "./vector.js";


const AppState = {
  DRAW: 'draw',
  EDIT: 'edit'
}

class App extends Application {
  start () {
    this.penButton = document.querySelector('#pen');
    this.moveButton = document.querySelector('#move');
    this.colorInput = document.querySelector('#color');
    this.widthInput = document.querySelector('#width');
    this.deleteButton = document.querySelector('#delete');
    this.actionsWrapper = document.querySelector('#actions');
    this.state = null; // "edit" or "draw"
    this.focusedSplineIndex = null;
    this.splines = []
    this.prevMousePosition = null;
    this.currMousePosition = null;

    this.setState(AppState.DRAW);
    this.setActionsVisibility(false);
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
    const { canvas, moveButton, penButton, deleteButton, colorInput, widthInput } = this;
    const add = canvas.addEventListener;

    add('pointerdown', this.onPointerDown.bind(this));
    add('pointerup', this.onPointerUp.bind(this));
    add('mousemove', this.onMouseMove.bind(this));

    document.addEventListener('keydown', this.onKeyDown.bind(this))

    penButton.addEventListener('click', this.onPenButtonClick.bind(this));
    moveButton.addEventListener('click', this.onMoveButtonClick.bind(this));
    deleteButton.addEventListener('click', this.onDeleteButtonClick.bind(this));
    colorInput.addEventListener('input', this.onChangeColorInput.bind(this));
    widthInput.addEventListener('input', this.onChangeWidthInput.bind(this));
  }

  onDeleteButtonClick () {
    if (this.focusedSpline !== null) {
      this.splines.splice(this.focusedSplineIndex, 1);
      this.focusedSplineIndex = null;
    }
  }

  onChangeWidthInput (event) {
    if (this.focusedSpline !== null) {
      this.focusedSpline.changeWidth(+event.target.value);
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

  setActionsVisibility(visible) {
    this.actionsWrapper.style.visibility = visible ? 'unset' : 'hidden';
    if (this.focusedSpline !== null) {
      this.widthInput.value = this.focusedSpline.width;
      this.colorInput.value = this.focusedSpline.color;
    }
  }

  setState (state) {
    const { penButton, moveButton, canvas } = this;
    this.state = state;
    this.focusedSplineIndex = null;
    if (state === AppState.EDIT) {
      penButton.classList.remove('focused');
      moveButton.classList.add('focused');
      canvas.style.cursor = 'default';
    }
    if (state === AppState.DRAW) {
      penButton.classList.add('focused');
      moveButton.classList.remove('focused')
      canvas.style.cursor = 'crosshair';
    }
  }

  onPointerDown (event) {
    const position = this._getEventPosition(event);

    let isAnySplineFocused = false;
    if (this.state === AppState.EDIT) {
      for (let i = 0; i < this.splines.length; i++) {
        const spline = this.splines[i];
        if (
          spline.checkPointIntersections(position) ||
          spline.checkCurveIntersection(position)
        ) {
          this.focusedSplineIndex = i;
          isAnySplineFocused = spline.isFocused;
          break;
        }
      }
      this.setActionsVisibility(isAnySplineFocused);
    }

    if (this.state === AppState.DRAW) {
      if (this.focusedSpline === null) {
        this.splines.push(new Bezier2d(new Spline()))
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
    this.focusedSpline.setFocusedPoint(position)
    if (this.state === AppState.EDIT) {
      this.prevMousePosition = currMousePosition;
      this.currMousePosition = position;

      const intersection = this.focusedSpline.getCurveIntersection(position);
      if (intersection !== null && prevMousePosition !== null) {
        const positionChange = subtract(currMousePosition, prevMousePosition);
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
    return this.transform([event.clientX, event.clientY]);
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
