import React, { useReducer } from "react";
import "./App.css";
import Gamepad from "react-gamepad";
import { TransitionGroup, Transition } from "react-transition-group";
import { message } from "antd";

import "antd/dist/antd.css";
import anime from "animejs";
import cross from "./images/cross.svg";
import square from "./images/square.svg";
import circle from "./images/circle.svg";
import triangle from "./images/triangle.svg";
import right from "./images/right.svg";
import left from "./images/left.svg";
import up from "./images/up.svg";
import down from "./images/down.svg";

const initialState = {
  recording: false,
  currPressed: {},
  buttonsPressed: [],
  currTime: null,
  timeElapsed: null
};

let states = [
  {
    state: 'initial'
  },
  {
    state: 'recording'
  },
  {
    state: ''
  }
]

function toggle(action, state) {
  if (action == true) {
    console.log("Started running")
    return {
      currPressed: state.currPressed,
      buttonsPressed: state.buttonsPressed,
      currTime: Date.now(),
      recording: true
    };
  } else {
    console.log("Stopped recording");
    return {
      ...state,
      recording: false,
      timeElapsed: Date.now() - state.currTime
    };
  }
}
function reducer(state, action) {
  // console.log("test", action.func);
  // console.log(state);
  console.log(action.func.begin);
  if (action.func.toggle) {
    let toggle = state.recording == true ? false : true
    return {
      ...state,
      recording: toggle,
      currTime: toggle === true ? Date.now() : null,
      timeElapsed: toggle === true ? null : Date.now() - state.currTime
    }
  }

  let buttonsPressed = state.buttonsPressed;

  let currPressed = state.currPressed;
  if (!currPressed[action.func.buttonName]) {
    currPressed[action.func.buttonName] = {
      button: action.func.buttonName
    };
  }

  if (action.func.down === true) {
    console.log("pressed");
    currPressed[action.func.buttonName].timeDown = Date.now() - state.currTime;
  } else {
    console.log("released");
    currPressed[action.func.buttonName].timeReleased =
      Date.now() - state.currTime;
  }

  if (
    currPressed[action.func.buttonName].timeDown &&
    currPressed[action.func.buttonName].timeReleased
  ) {
    buttonsPressed.push(currPressed[action.func.buttonName]);
    delete currPressed[action.func.buttonName];
  }

  return {
    recording: true,
    currPressed,
    buttonsPressed,
    currTime: state.currTime
  };
}

function connectHandler(gamepadIndex) {
  console.log(`Gamepad ${gamepadIndex} connected !`);
}

function disconnectHandler(gamepadIndex) {
  console.log(`Gamepad ${gamepadIndex} disconnected !`);
}

function buttonChangeHandler(buttonName, down) {
  return { buttonName, down };
}

function axisChangeHandler(axisName, value, previousValue) {
  console.log(axisName, value);
}

function buttonDownHandler(buttonName) {
  console.log(buttonName, "down");
}

function buttonUpHandler(buttonName) {
  console.log(buttonName, "up");
}

function updateProgress(ref, duration) {
  console.log("Updating progress");

  var basicTimeline = anime.timeline();
  console.log(ref);
  basicTimeline
    .add({
      targets: '.progress-bar',
      width:'100%',
      duration,
      easing: "easeOutSine"
    })
    ;
}
function getButton(buttonName) {
  let source;

  if (buttonName === "X") {
    source = square;
  } else if (buttonName === "Y") {
    source = triangle;
  } else if (buttonName === "B") {
    source = circle;
  } else if (buttonName === "DPadDown") {
    source = down;
  } else if (buttonName === "DPadUp") {
    source = up;
  } else if (buttonName === "DPadLeft") {
    source = left;
  } else if (buttonName === "DPadRight") {
    source = right;
  } else {
    source = cross;
  }
  return <img width={"30px"} src={source} />;
}

function toggleRecording() {
  message.info("Now recording...");
  return { toggle: true };
}


function reset() {
  return {reset: true}
}

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  console.log(state);
  let progressBar = null;

  return (
    <div className="main">
      <div className="bg-image"></div>

      <div className="content">
        <div className="button-map">
          <TransitionGroup component="div" className="buttons-pressed">
            {state.buttonsPressed.map(entry => (
              <Transition
                key={entry.time}
                timeout={500}
                appear={true}
                mountOnEnter
                unmountOnExit
              >
                {status => {
                  return (
                    <div className="list-item">
                      <b>{getButton(entry.button)}</b>
                    </div>
                  );
                }}
              </Transition>
            ))}
          </TransitionGroup>
          {state.timeElapsed && ( <div
            className="progress-bar"
            ref={ref => {
              console.log("wtf")
              progressBar = ref;
              updateProgress(progressBar, state.timeElapsed);
            }}
          ></div>)}
         
        </div>

        <div className="action-panel">
          <div className="buttons">

            {state.recording === true && (
                            <button onClick={() => dispatch({ func: reset() })}>
                            Reset
                          </button>
            )}
            {state.recording === false && (
              <button onClick={() => dispatch({ func: toggleRecording() })}>
                Record
              </button>
            )}

            {state.recording === true && (
              <button onClick={() => dispatch({ func: toggleRecording() })}>
                Stop
              </button>
            )}

            {state.timeElapsed && (
              <button onClick={() => dispatch({ func: toggleRecording() })}>
                Play
              </button>
            )}

            {state.timeElapsed && (
              <button onClick={() => dispatch({ func: toggleRecording() })}>
                Save
              </button>
            )}
          </div>
        </div>
        {state.recording == true && (
          <Gamepad
            onConnect={connectHandler}
            onDisconnect={disconnectHandler}
            onButtonChange={(buttonName, down) =>
              dispatch({ func: buttonChangeHandler(buttonName, down) })
            }
            onAxisChange={axisChangeHandler}
          >
            <React.Fragment />
          </Gamepad>
        )}
      </div>
    </div>
  );
}

export default App;
