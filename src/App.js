/* eslint-disable react/jsx-filename-extension */
/* eslint-disable no-console */
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
  playing: false,
  currPressed: {},
  buttonsPressed: [],
  currTime: null,
  timeElapsed: null
};

// let states = [
//   {
//     state: "initial"
//   },
//   {
//     state: "recording"
//   },
//   {
//     state: ""
//   }
// ];

const buttons = {
  X: square,
  Y: triangle,
  B: circle,
  A: cross,
  DPadDown: down,
  DPadUp: up,
  DPadLeft: left,
  DPadRight: right
};

function reducer(state, action) {
  console.log(action);

  return {
    ...state,
    ...action
  };
}

function connectHandler(gamepadIndex) {
  console.log(`Gamepad ${gamepadIndex} connected !`);
}

function disconnectHandler(gamepadIndex) {
  console.log(`Gamepad ${gamepadIndex} disconnected !`);
}

function buttonChangeHandler(buttonName, down, state) {
  const { currPressed } = state;

  if (currPressed[buttonName] === undefined) {
    currPressed[buttonName] = {
      button: buttonName
    };
  }

  if (down === true) {
    currPressed[buttonName].timeDown = Date.now() - state.currTime;
  } else {
    currPressed[buttonName].timeReleased = Date.now() - state.currTime;
  }

  const { buttonsPressed } = state;

  if (
    currPressed[buttonName].timeDown &&
    currPressed[buttonName].timeReleased
  ) {
    buttonsPressed.push(currPressed[buttonName]);
    delete currPressed[buttonName];
  }

  return { currPressed, buttonsPressed };
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
  const basicTimeline = anime.timeline();
  console.log(ref);
  basicTimeline.add({
    targets: ".progress-bar",
    width: "100%",
    duration,
    easing: "easeOutSine"
  });
}
function getButton(buttonName) {
  return <img width={"30px"} src={buttons[buttonName]} alt={buttonName} />;
}

function toggleRecording(state) {
  if (state.recording === false) {
    message.info("Now recording...");

    return {
      currPressed: state.currPressed,
      buttonsPressed: state.buttonsPressed,
      currTime: Date.now(),
      recording: true
    };
  }
  message.info("Stopped recording...");

  return {
    ...state,
    recording: false,
    timeElapsed: Date.now() - state.currTime
  };
}

function reset() {
  console.log(initialState);
  return {
    recording: false,
    playing: false,
    currPressed: {},
    buttonsPressed: [],
    currTime: null,
    timeElapsed: null
  };
}

function playRecording() {
  return { playing: true };
}

function saveRecording() {
  return { saved: true };
}

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  console.log(state);
  let progressBar = null;

  return (
    <div className="main">
      <div className="bg-image" />

      <div className="content">
        <div className="button-map">
          {state.buttonsPressed && (
            <TransitionGroup component="div" className="buttons-pressed">
              {state.buttonsPressed.map(entry => (
                <Transition
                  key={entry.time}
                  timeout={10}
                  appear
                  mountOnEnter
                  unmountOnExit
                >
                  {() => (
                    <div className="list-item">
                      <b>{getButton(entry.button)}</b>
                    </div>
                  )}
                </Transition>
              ))}
            </TransitionGroup>
          )}

          {state.playing && (
            <div
              className="progress-bar"
              ref={ref => {
                progressBar = ref;
                updateProgress(progressBar, state.timeElapsed);
              }}
            />
          )}
        </div>

        <div className="action-panel">
          <div className="buttons">
            {state.recording === false && state.timeElapsed && (
              <button type="button" onClick={() => dispatch(reset())}>
                Reset
              </button>
            )}
            {state.recording === false && (
              <button
                type="button"
                onClick={() => dispatch(toggleRecording(state))}
              >
                Record
              </button>
            )}

            {state.recording === true && (
              <button
                type="button"
                onClick={() => dispatch(toggleRecording(state))}
              >
                Stop
              </button>
            )}

            {state.timeElapsed && (
              <button type="button" onClick={() => dispatch(playRecording())}>
                Play
              </button>
            )}

            {state.timeElapsed && (
              <button type="button" onClick={() => dispatch(saveRecording())}>
                Save
              </button>
            )}
          </div>
        </div>
        {state.recording === true && (
          <Gamepad
            onConnect={connectHandler}
            onDisconnect={disconnectHandler}
            onButtonChange={(buttonName, down) =>
              dispatch(buttonChangeHandler(buttonName, down, state))
            }
            onAxisChange={axisChangeHandler}
          >
            <></>
          </Gamepad>
        )}
      </div>
    </div>
  );
}

export default App;
