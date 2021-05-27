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
import circle from './components/ButtonMap/images/circle.svg';
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
  const loadImages = () => {
      const img = new Image();
      img.src = circle
      return [img]
  }
  const [loadedImages, setLoadedImages] = useState(loadImages);
  const requestRef = useRef();
  const canvasRef = useRef();
  function draw() {
    if (!canvasRef.current) return;

    const button = loadedImages[0];
    const ctx = canvasRef.current.getContext('2d');
    ctx.imageSmoothingEnabled = false;

    ctx.globalCompositeOperation = 'destination-over';
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight); // clear canvas
    // ctx.drawImage(button, 30, 10);

    console.log("STATE", state);
    state.buttonsPressed.forEach((btn) => {
        console.log("Pressed", startTime, (Date.now() - startTime + btn.timeReleased) / 60,  (Date.now() - startTime) / 60)
        ctx.drawImage(button, (Date.now() - startTime + btn.timeReleased) / 60, 0);
    })
    ctx.save();
    ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
    ctx.strokeStyle = 'rgba(0, 153, 255, 0.4)';
    ctx.fillRect(0, 0, (Date.now() - startTime) / 60, 150); // Shadow
    ctx.save();

    // requestRef.current = window.requestAnimationFrame(draw);
  }

  useEffect(() => {
    if (state.recording) {
      setStartTime(Date.now());
    } else {
      window.cancelAnimationFrame(requestRef.current);
    }
  }, [state.recording]);

  useEffect(() => {
      if (state.buttonsPressed.length > 0) {
         requestRef.current = window.requestAnimationFrame(draw);
    }
  }, [state.buttonsPressed])

  useEffect(() => {
    console.log('effect', canvasRef.current);
    if (startTime !== 0) {
        const images = [
            'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/PNG_Test.png/800px-PNG_Test.png',
          ];
          const loadedImages = {};
          const promiseArray = images.map(function (imgurl) {
            const prom = new Promise(function (resolve, reject) {
              const img = new Image();
              img.onload = function () {
                loadedImages[imgurl] = img;
                resolve();
              };
              img.src = imgurl;
            });
            return prom;
          });
    
        //   Promise.all(promiseArray).then(() => {
        //     requestRef.current = window.requestAnimationFrame(draw);
        //   });
    }
  }, [startTime]);

  useEffect(() => {
    const inputMode = localStorage.getItem('inputMode') || 'controller'
    dispatch(setInputMode(inputMode))
  }, [])
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
          <ComboName state={state} />
          <canvas ref={canvasRef} id="canvas" style={{ height: '20vh', width: '960px' }} width="960" />
          <ActionBar state={state} dispatch={dispatch} />

          {state.recording === true && state.inputMode === 'controller' && (
            <Gamepad
              onConnect={connectHandler}
              onDisconnect={disconnectHandler}
              onButtonDown={(buttonName) => Button.buttonDownHandler(buttonName, state)}
              onButtonUp={(buttonName) => dispatch(Button.buttonUpHandler(buttonName, state))}
            >
              <></>
            </Gamepad>
          )}

          {state.recording === true && state.inputMode === 'PC' && (
            <KeyboardController
              onButtonDown={(buttonName) => Button.buttonDownHandler(buttonName, state)}
              onButtonUp={(buttonName) => dispatch(Button.buttonUpHandler(buttonName, state))}
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
              onChange={(change) => dispatch(setInputMode(change.target.value))}
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
