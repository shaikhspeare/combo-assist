/* eslint-disable react/jsx-filename-extension */
/* eslint-disable no-console */
import React, { useReducer, useEffect, useState, useRef } from 'react';
import './App.css';
import Gamepad from 'react-gamepad';
import 'antd/dist/antd.css';
import { message, Radio } from 'antd';
import Modal from 'react-modal';
import ActionBar from './components/ActionBar/ActionBar';
import ButtonMap, { getButton, buttons } from './components/ButtonMap/ButtonMap';
import ComboName from './components/ComboName/ComboName';
import Button from './utils/ButtonLinks';

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
function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [startTime, setStartTime] = useState(0);
  const requestRef = useRef();
  function draw() {
    const ctx = document.getElementById('canvas').getContext('2d');
    ctx.globalCompositeOperation = 'destination-over';
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight); // clear canvas
    
    ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
    ctx.strokeStyle = 'rgba(0, 153, 255, 0.4)';
    ctx.fillRect(0, 0, (Date.now() - startTime) / 60, 150); // Shadow

    ctx.save();
    
    console.log('Elapsed time', Date.now() - startTime, startTime);
    requestRef.current = window.requestAnimationFrame(draw);
  }

  useEffect(() => {
    document.getElementById("canvas").style.width = "100%";
    document.getElementById("canvas").style.height = "100%";
  }, []);

  useEffect(() => {
    console.log("REC", state.recording)
    if (state.recording) {
        setStartTime(Date.now())
    } else {
        window.cancelAnimationFrame(requestRef.current);
    }
  }, [state.recording])

  useEffect(() => {
      if (startTime !== 0) {
        requestRef.current = window.requestAnimationFrame(draw);
      }
  }, [startTime])

  const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
    },
    overlay: {
      zIndex: 100,
    },
  };

  const head = new Button(null, null, null);

  return (
    <>
      <div className="main">
        <div className="bg-image" />

        <div className="content">
          <ComboName state={state} />
          <ButtonMap head={head}>
            <canvas id="canvas" />
          </ButtonMap>
          
          <ActionBar state={state} dispatch={dispatch} />

          {state.recording === true && state.inputMode === 'controller' && (
            <Gamepad
              onConnect={connectHandler}
              onDisconnect={disconnectHandler}
              onButtonDown={(buttonName) => dispatch(Button.buttonDownHandler(buttonName, state))}
              onButtonUp={(buttonName) => dispatch(Button.buttonUpHandler(buttonName, state, head))}
            >
              <></>
            </Gamepad>
          )}
        </div>
      </div>

      <Modal
        className="Modal"
        style={customStyles}
        isOpen={state.bindingIsOpen}
        onRequestClose={() => dispatch(closeModal())}
        contentLabel="Example Modal"
      >
        <h2 className="bindings-header">Key Bindings</h2>

        <div className="controller-buttons">
          <ul className="button-list">
            {Object.keys(buttons).map((button) => (
              <li>
                <button type="button" onClick={() => dispatch(setPCBinding(button))}>
                  {getButton(button)}
                </button>
                {buttons[button].PC}
              </li>
            ))}
          </ul>
          <div className="mode-select">
            <Radio.Group
              onChange={(change) => dispatch(setInputMode(change))}
              defaultValue={state.inputMode}
              buttonStyle="solid"
            >
              <Radio.Button value="controller">Controller</Radio.Button>
              <Radio.Button value="PC">PC</Radio.Button>
            </Radio.Group>
          </div>
        </div>
      </Modal>
    </>
  );
}

export default App;
