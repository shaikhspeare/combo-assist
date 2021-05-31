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
    console.log('Pushing', button);
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
    console.log('Down', buttonName);
    this.button = buttonName;
    this.timeDown = Date.now() - state.currTime;

    return 1;
  }

  static buttonUpHandler(buttonName, state) {
    console.log('Up', buttonName, this.timeDown);
    if (this.timeDown) {
      const timeReleased = Date.now() - state.currTime;
      const newButton = new Button(buttonName, this.timeDown, timeReleased);
      return { newButton };
    }
    return null;
  }
}
