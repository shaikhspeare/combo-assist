/* eslint-disable no-restricted-syntax */
/* eslint-disable react/jsx-filename-extension */
/* eslint-disable no-console */
import React, { useReducer, useEffect, useState, useRef } from 'react';
import './App.css';
import Gamepad from 'react-gamepad';
import 'antd/dist/antd.css';
import { message, Radio } from 'antd';
import Modal from 'react-modal';
import ActionBar from './components/ActionBar/ActionBar';
import { getButton, buttons } from './components/ButtonMap/ButtonMap';
import ComboName from './components/ComboName/ComboName';
import Button from './utils/ButtonLinks';
import KeyboardController from './components/KeyboardController';

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
  buttonMappings: {},
};

function reducer(state, action) {
  console.log(action, state);
  if (action.newButton) {
    return {
      ...state,
      buttonsPressed: [...state.buttonsPressed, action.newButton],
    };
  }
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

function setInputMode(value) {
  localStorage.setItem('inputMode', value);
  return { inputMode: value };
}

function setPCBinding(button) {}
function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [startTime, setStartTime] = useState(0);

  const [loadedImages, setLoadedImages] = useState({});
  const requestRef = useRef();
  const canvasRef = useRef();
  function draw() {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    ctx.globalCompositeOperation = 'source-over';
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight); // clear canvas
    ctx.fillStyle = 'rgba(208, 1, 27, 0.3)';
    ctx.fillRect(0, 0, (Date.now() - startTime) / 10, 150); // Shadow
    ctx.save();

    state.buttonsPressed.forEach((btn) => {
      ctx.drawImage(loadedImages[btn.button], btn.timeReleased / 10, 50, 25, 25);
      ctx.save();
    });

    requestRef.current = window.requestAnimationFrame(draw);
  }

  function resetCanvas() {
    const ctx = canvasRef.current.getContext('2d');
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight); // clear canvas
    ctx.save();
  }

  useEffect(() => {
    console.log('cancelled frame', state.recording);

    if (state.recording && !state.playing) {
      setStartTime(Date.now());
    } else {
      console.log('CANCELLING');
      window.cancelAnimationFrame(requestRef.current);
    }
  }, [state.recording]);

  useEffect(() => {
    console.log('START TIME', startTime);
    if (startTime !== 0 && state.recording) {
      window.cancelAnimationFrame(requestRef.current);
      requestRef.current = window.requestAnimationFrame(draw);
    }
    if (startTime !== 0 && state.playing) {
      window.cancelAnimationFrame(requestRef.current);
      requestRef.current = window.requestAnimationFrame(draw);
    }
  }, [startTime]);

  useEffect(() => {
    if (state.buttonsPressed.length > 0 && state.recording) {
      window.cancelAnimationFrame(requestRef.current);
      requestRef.current = window.requestAnimationFrame(draw);
    } else if (state.buttonsPressed.length === 0 && !state.recording) {
      window.cancelAnimationFrame(requestRef.current);
      requestRef.current = window.requestAnimationFrame(resetCanvas);
    }
  }, [state.buttonsPressed]);

  useEffect(() => {
    const inputMode = localStorage.getItem('inputMode');
    if (inputMode) {
      dispatch(setInputMode(inputMode));
    }
  }, []);

  useEffect(() => {
    const newButtonMap = {};
    if (state.inputMode === 'PC') {
      for (const [_, value] of Object.entries(buttons)) {
        const img = new Image();
        img.src = value.img;
        newButtonMap[value.PC] = img;
      }
      setLoadedImages(newButtonMap);
    } else {
      for (const [key, value] of Object.entries(buttons)) {
        const img = new Image();
        img.src = value.img;
        newButtonMap[key] = img;
      }
      setLoadedImages(newButtonMap);
    }
  }, [state.inputMode]);

  useEffect(() => {
    if (state.playing) {
      setStartTime(Date.now());
    }
  }, [state.playing]);
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

  return (
    <>
      <div className="main">

        <div className="bg-image" />

        <div className="content">
        <div className="header">
          <h1>Combot</h1>
          <span>This tool lets you create your own combos and replay them in real-time! <br />
          You can soon also share these combos with other people.</span>
        </div>
          <ComboName state={state} />
          <canvas
            ref={canvasRef}
            id="canvas"
            style={{ height: '20vh', width: '960px' }}
            width="960"
          />
          <ActionBar state={state} dispatch={dispatch} />

          {state.recording === true && state.inputMode === 'controller' && (
            <Gamepad
              onConnect={connectHandler}
              onDisconnect={disconnectHandler}
              onButtonDown={(buttonName) =>
                loadedImages[buttonName] && Button.buttonDownHandler(buttonName, state)
              }
              onButtonUp={(buttonName) =>
                loadedImages[buttonName] && dispatch(Button.buttonUpHandler(buttonName, state))
              }
            >
              <></>
            </Gamepad>
          )}

          {state.recording === true && state.inputMode === 'PC' && (
            <KeyboardController
              onButtonDown={(buttonName) =>
                loadedImages[buttonName] && Button.buttonDownHandler(buttonName, state)
              }
              onButtonUp={(buttonName) =>
                loadedImages[buttonName] && dispatch(Button.buttonUpHandler(buttonName, state))
              }
            />
          )}
        </div>
      </div>

      <Modal
        className="Modal"
        style={customStyles}
        isOpen={state.bindingIsOpen}
        onRequestClose={() => dispatch(closeModal())}
        contentLabel="Example Modal"
        overlayClassName="overlay"

      >
        <h2 className="bindings-header">Key Bindings</h2>

        <div className="controller-buttons">
          <ul className="button-list">
            {Object.keys(buttons).map((button) => (
              <li>
                <button type="button" onClick={() => console.log('hey')}>
                  {getButton(button)}
                </button>
                {buttons[button].PC}
              </li>
            ))}
          </ul>
          <div className="mode-select">
            <Radio.Group
              onChange={(change) => dispatch(setInputMode(change.target.value))}
              defaultValue={state.inputMode}
              buttonStyle="solid"
            >
              <Radio.Button value="controller">Controller</Radio.Button>
              <Radio.Button value="PC">Keyboard</Radio.Button>
            </Radio.Group>
          </div>
        </div>
      </Modal>

      <Modal
        className="Modal"
        style={customStyles}
        isOpen={!localStorage.getItem('inputMode')}
        onRequestClose={() => dispatch(closeModal())}
        contentLabel="Example Modal"
        overlayClassName="overlay"

      >
        <div>
          <h2 className="bindings-header">Are you using a controller or a keyboard?</h2>
          <div className="mode-select" style={{display: 'flex', justifyContent: 'center'}}>
            <Radio.Group
              onChange={(change) => dispatch(setInputMode(change.target.value))}
              defaultValue={state.inputMode}
              buttonStyle="solid"
            >
              <Radio.Button value="controller">Controller</Radio.Button>
              <Radio.Button value="PC">Keyboard</Radio.Button>
            </Radio.Group>
          </div>
        </div>
      </Modal>
    </>
  );
}

export default App;
