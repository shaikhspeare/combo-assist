/* eslint-disable react/jsx-filename-extension */
/* eslint-disable no-console */
import React, { useReducer } from 'react';
import './App.css';
import Gamepad from 'react-gamepad';
import 'antd/dist/antd.css';
import { message, Radio } from 'antd';
import Modal from 'react-modal';
import ActionBar from './components/ActionBar/ActionBar';
import ButtonMap, { getButton, buttons } from './components/ButtonMap/ButtonMap';
import ComboName from './components/ComboName/ComboName';

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

function buttonDownHandler(buttonName, state) {
  const { currPressed } = state;
  if (currPressed[buttonName] === undefined) {
    currPressed[buttonName] = {
      button: buttonName,
    };
  }
  currPressed[buttonName].timeDown = Date.now() - state.currTime;

  return { currPressed };
}

function buttonUpHandler(buttonName, state) {
  const { currPressed, intermediaryButtons, buttonsPressed } = state;
  const currButton = currPressed[buttonName];
  currButton.timeReleased = Date.now() - state.currTime;
  if (currButton.timeDown && currButton.timeReleased) {
    intermediaryButtons[buttonName] = currButton;
    buttonsPressed.push(currButton);
    delete currPressed[buttonName];
  }
  return { currPressed, intermediaryButtons };
}

function closeModal() {
  return { bindingIsOpen: false };
}

function setInputMode(event) {
  return { inputMode: event.target.value}
}

function setPCBinding(button) {}
function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
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
          <ButtonMap state={state} />

          <ActionBar state={state} dispatch={dispatch} />

          {state.recording === true && state.inputMode === 'controller' && (
            <Gamepad
              onConnect={connectHandler}
              onDisconnect={disconnectHandler}
              onButtonDown={buttonName => dispatch(buttonDownHandler(buttonName, state))}
              onButtonUp={buttonName => dispatch(buttonUpHandler(buttonName, state))}
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
            {Object.keys(buttons).map(button => (
              <li>
                <button type="button" onClick={() => dispatch(setPCBinding(button))}>
                  {getButton(button)}
                </button>
                {buttons[button].PC}
              </li>
            ))}
          </ul>
          <div className="mode-select">
            <Radio.Group onChange={(change) => dispatch(setInputMode(change))} defaultValue={state.inputMode} buttonStyle="solid">
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
