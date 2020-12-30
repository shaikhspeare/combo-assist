/* eslint-disable react/jsx-filename-extension */
/* eslint-disable no-console */
import React, { useReducer, useEffect, useState, useRef, useMemo } from 'react';
import './App.css';
import Gamepad from 'react-gamepad';
import 'antd/dist/antd.css';
import { message, Radio } from 'antd';
import Modal from 'react-modal';
import { Canvas, useFrame } from 'react-three-fiber';
import { TextureLoader, Box3Helper, Clock } from 'three';
import ActionBar from './components/ActionBar/ActionBar';
// import ButtonMap, { getButton, buttons } from './components/ButtonMap/ButtonMap';
import ComboName from './components/ComboName/ComboName';
import Button from './utils/ButtonLinks';
import Box from './models/Box.js';
import ButtonFactory from './ButtonFactory';
import Helpers from './Helpers'
import TimerBar from './TimerBar'
import KeyboardListener from './KeyboardListener';

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
  timeElapsed: null,
  bindingIsOpen: false,
  inputMode: 'controller',
};

function reducer(state, action) {
  console.log(action);

  return {
    ...state,
    ...action,
  };
}

function connectHandler(gamepadIndex) {
  message.info('Controller has been connected');
  console.log(`Gamepad ${gamepadIndex} connected !`);
}

function disconnectHandler(gamepadIndex) {
  console.log(`Gamepad ${gamepadIndex} disconnected !`);
}

function closeModal() {
  return { bindingIsOpen: false };
}

function setInputMode(event) {
  return { inputMode: event.target.value };
}

function setPCBinding(button) {}

function buttonUpHandler(buttonName, state) {
  console.log(buttonName);
}

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [buttonList, setButtonList] = useState([]);
  const factory = new ButtonFactory();
  const startDate = useMemo(() => Date.now(), []);

  function buttonDownHandler(buttonName) {
    console.log('Button presed', buttonName, startDate);
    const newButton = factory.create({
      button: buttonName,
      time: Date.now() - startDate,
    });

    const currList = buttonList;
    currList.push(newButton);
    setButtonList(currList);
  }

  console.log(buttonList);

  return (
    <>
      <Gamepad
        onConnect={connectHandler}
        onDisconnect={disconnectHandler}
        onButtonDown={(buttonName) => dispatch(buttonDownHandler(buttonName, state))}
        onButtonUp={(buttonName) => dispatch(buttonUpHandler(buttonName, state))}
      >
        <></>
      </Gamepad>
      <KeyboardListener
              onButtonDown={(buttonName) => dispatch(buttonDownHandler(buttonName, state))}
              onButtonUp={(buttonName) => dispatch(buttonUpHandler(buttonName, state))} />
        <ActionBar state={state} dispatch={dispatch} />
      <Canvas
        style={{ height: "80vh", width: window.innerWidth,  background: 'radial-gradient(at 50% 60%, #873740 0%, #272730 40%, #171720 80%, #070710 100%)'  }}
        className="usoCanvas"        
      >
        <Helpers />
        {/* <axesHelper /> */}
        <ambientLight />
        <pointLight position={[10, 10, 10]} />
        {/* <group position={[0, 0, 0]}>{buttonList}</group> */}
        <TimerBar time={Date.now() - startDate} />
      </Canvas>
    </>
  );
}

export default App;
