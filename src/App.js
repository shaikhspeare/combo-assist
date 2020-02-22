/* eslint-disable react/jsx-filename-extension */
/* eslint-disable no-console */
import React, { useReducer } from "react";
import "./App.css";
import Gamepad from "react-gamepad";
import { TransitionGroup, Transition } from "react-transition-group";

import "antd/dist/antd.css";
import cross from "./images/cross.svg";
import square from "./images/square.svg";
import circle from "./images/circle.svg";
import triangle from "./images/triangle.svg";
import right from "./images/right.svg";
import left from "./images/left.svg";
import up from "./images/up.svg";
import down from "./images/down.svg";
import ActionBar from "./components/ActionBar/ActionBar";
import ProgressBar from "./components/ProgressBar/ProgressBar";

const initialState = {
  recording: false,
  playing: false,
  currPressed: {},
  buttonsPressed: [],
  currTime: null,
  timeElapsed: null
};

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

// function buttonDownHandler(buttonName) {
//   console.log(buttonName, "down");
// }

// function buttonUpHandler(buttonName) {
//   console.log(buttonName, "up");
// }

function getButton(buttonName) {
  return <img width="30px" src={buttons[buttonName]} alt={buttonName} />;
}

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);

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
          {state.playing && <ProgressBar />}
        </div>

        <ActionBar state={state} dispatch={dispatch} />

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
