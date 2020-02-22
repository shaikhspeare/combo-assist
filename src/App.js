/* eslint-disable react/jsx-filename-extension */
/* eslint-disable no-console */
import React, { useReducer } from "react";
import "./App.css";
import Gamepad from "react-gamepad";
import "antd/dist/antd.css";
import ActionBar from "./components/ActionBar/ActionBar";
import ButtonMap from "./components/ButtonMap/ButtonMap";
import ComboName from "./components/ComboName/ComboName";

const initialState = {
  recording: false,
  playing: false,
  currPressed: {},
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
  console.log(`Gamepad ${gamepadIndex} connected !`);
}

function disconnectHandler(gamepadIndex) {
  console.log(`Gamepad ${gamepadIndex} disconnected !`);
}

function buttonChangeHandler(buttonName, down, state) {
  const { currPressed, buttonsPressed } = state;

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
