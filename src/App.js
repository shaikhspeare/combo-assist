/* eslint-disable react/jsx-filename-extension */
/* eslint-disable no-console */
import React, { useReducer } from "react";
import "./App.css";
import Gamepad from "react-gamepad";
import "antd/dist/antd.css";
import { message } from "antd";
import ActionBar from "./components/ActionBar/ActionBar";
import ButtonMap from "./components/ButtonMap/ButtonMap";
import ComboName from "./components/ComboName/ComboName";

/**
 * recording: Is tool currently recording
 * playing: Is tool currently playing
 * currPressed: Buttons currently pressed and have not been released yet
 * intermediaryButtons: Buttons that have recently been pressed and released due to be pushed into buttonsPressed
 * buttonsPressed: Buttons that have been pressed and released
 * currTime: Current length of the recording
 * timeElapsed: Total length of the recording
 */
const initialState = {
  recording: false,
  playing: false,
  currPressed: {},
  intermediaryButtons: {},
  buttonsPressed: [],
  currTime: null,
  timeElapsed: null
};

function reducer(state, action) {
  console.log(action);

  return {
    ...state,
    ...action
  };
}

function connectHandler(gamepadIndex) {
  message.info("Controller has been connected");
  console.log(`Gamepad ${gamepadIndex} connected !`);
}

function disconnectHandler(gamepadIndex) {
  console.log(`Gamepad ${gamepadIndex} disconnected !`);
}

function buttonDownHandler(buttonName, state) {
  const { currPressed } = state;
  if (currPressed[buttonName] === undefined) {
    currPressed[buttonName] = {
      button: buttonName
    };
  }
  currPressed[buttonName].timeDown = Date.now() - state.currTime;

  return { currPressed };
}

function buttonUpHandler(buttonName, state) {
  const { currPressed, intermediaryButtons } = state;
  const currButton = currPressed[buttonName];
  currButton.timeReleased = Date.now() - state.currTime;
  if (currButton.timeDown && currButton.timeReleased) {
    intermediaryButtons[buttonName] = currButton;
    delete currPressed[buttonName];
  }
  return { currPressed, intermediaryButtons };
}

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <div className="main">
      <div className="bg-image" />

      <div className="content">
        <ComboName state={state} />
        <ButtonMap state={state} />

        <ActionBar state={state} dispatch={dispatch} />

        {state.recording === true && (
          <Gamepad
            onConnect={connectHandler}
            onDisconnect={disconnectHandler}
            onButtonDown={buttonName =>
              dispatch(buttonDownHandler(buttonName, state))
            }
            onButtonUp={buttonName =>
              dispatch(buttonUpHandler(buttonName, state))
            }
          >
            <></>
          </Gamepad>
        )}
      </div>
    </div>
  );
}

export default App;
