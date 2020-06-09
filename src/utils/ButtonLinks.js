/* eslint-disable no-console */
/* eslint-disable class-methods-use-this */
export default class Button {
  constructor(button, timeDown, timeReleased) {
    this.button = button;
    this.timeDown = timeDown;
    this.timeReleased = timeReleased;
    this.next = null;
    this.prev = null;
  }

  pushButton(button) {
    console.log("Pushing", button);
    this.next = button;
    this.next.prev = this;
  }

  getButtons() {
      let runner = this;
      while (runner != null) {
          console.log(this.button);
          runner = runner.next;
      }
  }

  static buttonDownHandler(buttonName, state) {
    const { currPressed } = state;
    if (currPressed[buttonName] === undefined) {
      currPressed[buttonName] = {
        button: buttonName,
      };
         }
    currPressed[buttonName].timeDown = Date.now() - state.currTime;

    return { currPressed };
  }

  static buttonUpHandler(buttonName, state, runner) {
    const { currPressed } = state;
    const currButton = currPressed[buttonName];

    if (currButton.timeDown) {
      const timeReleased = Date.now() - state.currTime;
      const {timeDown} = currButton;
      const newButton = new Button(buttonName, timeDown, timeReleased);
      runner.pushButton(newButton);
      delete currPressed[buttonName];
    }

    return { currPressed };
  }
}

